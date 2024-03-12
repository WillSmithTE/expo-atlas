import picomatch from 'picomatch';

import { resolveStatsFile } from '~/config';
import { filtersFromUrlParams } from '~/providers/modules';
import { type MetroStatsModule, type MetroStatsEntry } from '~plugin/metro/convertGraphToStats';
import { getStatsEntry, validateStatsFile } from '~plugin/metro/serializeStatsFile';

/** The partial module data, when listing all available modules from a stats entry */
export type PartialModule = Omit<MetroStatsModule, 'source' | 'output'>;

export async function GET(request: Request, params: Record<'entry', string>) {
  const statsFile = resolveStatsFile();

  try {
    await validateStatsFile(statsFile);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const entryId = params.entry ? parseInt(params.entry, 10) : null;
  if (!entryId || Number.isNaN(entryId) || entryId <= 1) {
    return Response.json({ error: `Stats entry "${params.entry}" not found.` }, { status: 404 });
  }

  const entry = await getStatsEntry(statsFile, entryId);
  const filteredModules = filterModules(request, entry);

  return Response.json({
    metadata: {
      platform: entry.platform,
      size: entry.graph.dependencies.reduce((size, module) => size + module.size, 0),
      modulesCount: entry.graph.dependencies.length,
    },
    data: {
      size: filteredModules.reduce((size, module) => size + module.size, 0),
      modulesCount: filteredModules.length,
      modules: filteredModules,
    },
  });
}

/**
 * Filter the node modules based on query parameters.
 *   - `modules=project,node_modules` to show only project code and/or node_modules
 *   - `include=<glob>` to only include specific glob patterns
 *   - `exclude=<glob>` to only exclude specific glob patterns
 */
function filterModules(request: Request, stats?: MetroStatsEntry) {
  if (!stats) return [];

  const filters = filtersFromUrlParams(new URL(request.url).searchParams);

  let filteredModules = stats.graph.dependencies ?? [];

  if (!filters.types.includes('node_modules')) {
    filteredModules = filteredModules.filter((module) => !module.isNodeModule);
  }

  if (filters.include || filters.exclude) {
    const matcher = picomatch(prefixPattern(filters.include || null) ?? '**', {
      cwd: stats.options.serverRoot ?? stats.options.projectRoot,
      nocase: true,
      ignore: prefixPattern(filters.exclude || null),
    });

    filteredModules = filteredModules.filter((module) => matcher(module.absolutePath));
  }

  return filteredModules.map((module) => ({
    ...module,
    source: undefined,
    output: undefined,
  }));
}

/** Prefix the patterns with `**\/` to make the globs search on the ending patterns */
function prefixPattern(pattern: string | null) {
  if (pattern === null) return undefined;
  if (['!', '*', '/'].includes(pattern[0])) return pattern;
  return `**/${pattern}`;
}

/**
 * Get the full module information through a post request.
 */
export async function POST(request: Request, params: Record<'entry', string>) {
  const statsFile = resolveStatsFile();

  try {
    await validateStatsFile(statsFile);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const entryId = params.entry ? parseInt(params.entry, 10) : null;
  if (!entryId || Number.isNaN(entryId) || entryId <= 1) {
    return Response.json({ error: `Stats entry "${params.entry}" not found.` }, { status: 404 });
  }

  const moduleRef: string | undefined = (await request.json()).path;
  if (!moduleRef) {
    return Response.json(
      { error: `Module ID not provided, expected a "path" property.` },
      { status: 406 }
    );
  }

  const statsEntry = await getStatsEntry(statsFile, entryId);
  const moduleEntry = findModule(statsEntry.graph.dependencies, moduleRef);

  return moduleEntry
    ? Response.json(moduleEntry)
    : Response.json({ error: `Module "${moduleRef}" not found.` }, { status: 404 });
}

function findModule(modules: MetroStatsModule[], path: string) {
  const absolute = modules.find((module) => module.absolutePath === path);
  if (absolute) return absolute;
  return modules.find((module) => module.relativePath === path);
}
