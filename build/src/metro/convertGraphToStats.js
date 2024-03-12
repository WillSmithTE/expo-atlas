"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertGraphToStats = void 0;
var path_1 = __importDefault(require("path"));
function convertGraphToStats(_a) {
    var _b;
    var projectRoot = _a.projectRoot, entryPoint = _a.entryPoint, preModules = _a.preModules, graph = _a.graph, options = _a.options;
    return {
        projectRoot: projectRoot,
        entryPoint: entryPoint,
        platform: (_b = graph.transformOptions.platform) !== null && _b !== void 0 ? _b : 'unknown',
        preModules: preModules.map(function (module) { return convertModule(projectRoot, graph, module); }),
        graph: convertGraph(projectRoot, graph),
        options: convertOptions(options),
    };
}
exports.convertGraphToStats = convertGraphToStats;
function convertOptions(options) {
    return __assign(__assign({}, options), { processModuleFilter: undefined, createModuleId: undefined, getRunModuleStatement: undefined, shouldAddToIgnoreList: undefined });
}
function convertGraph(projectRoot, graph) {
    return __assign(__assign({}, graph), { entryPoints: Array.from(graph.entryPoints.values()), dependencies: Array.from(graph.dependencies.values()).map(function (dependency) { return (convertModule(projectRoot, graph, dependency)); }) });
}
function convertModule(projectRoot, graph, module) {
    var nodeModuleName = getNodeModuleNameFromPath(module.path);
    var isTextFile = ['.js', '.mjs', '.cjs', '.ts', '.jsx', '.tsx', '.json'].includes(path_1.default.extname(module.path));
    return {
        nodeModuleName: nodeModuleName || '[unknown]',
        isNodeModule: !!nodeModuleName,
        relativePath: path_1.default.relative(projectRoot, module.path),
        absolutePath: module.path,
        size: getModuleOutputInBytes(module),
        dependencies: Array.from(module.dependencies.values()).map(function (dependency) { return (path_1.default.relative(projectRoot, dependency.absolutePath)); }),
        inverseDependencies: Array.from(module.inverseDependencies)
            .filter(function (dependencyPath) { return graph.dependencies.has(dependencyPath); })
            .map(function (dependencyPath) { return ({
            relativePath: path_1.default.relative(projectRoot, dependencyPath),
            absolutePath: dependencyPath,
        }); }),
        source: isTextFile ? module.getSource().toString('utf-8') : '[binary file]',
        output: module.output.map(function (output) { return ({
            type: output.type,
            data: { code: output.data.code }, // Avoid adding source maps, this is too big for json
        }); }),
    };
}
function getModuleOutputInBytes(module) {
    return module.output.reduce(function (bytes, module) { return bytes + Buffer.byteLength(module.data.code, 'utf-8'); }, 0);
}
var nodeModuleNameCache = new Map();
function getNodeModuleNameFromPath(path) {
    var _a;
    if (nodeModuleNameCache.has(path)) {
        return (_a = nodeModuleNameCache.get(path)) !== null && _a !== void 0 ? _a : null;
    }
    var segments = path.split('/');
    for (var i = segments.length - 1; i >= 0; i--) {
        if (segments[i] === 'node_modules') {
            var name_1 = segments[i + 1];
            if (name_1.startsWith('@') && i + 2 < segments.length) {
                name_1 += '/' + segments[i + 2];
            }
            nodeModuleNameCache.set(path, name_1);
            return name_1;
        }
    }
    return null;
}
//# sourceMappingURL=convertGraphToStats.js.map