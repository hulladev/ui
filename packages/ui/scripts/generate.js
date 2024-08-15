"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prompts_1 = require("@clack/prompts");
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var pc = require("picocolors");
var utils_1 = require("../lib/utils");
var execPromise = (0, node_util_1.promisify)(child_process_1.exec);
/**
 * Runs the generated files compiler. Look into individual helper functions for more information.
 */
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var isClean, updatedComponents, s, changedFiles, _a, updateDirs;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    isClean = process.argv.slice(2).includes('--clean');
                    if (!isClean) return [3 /*break*/, 2];
                    (0, prompts_1.intro)("[".concat(pc.cyan('@hulla/ui 🤖'), "] Cleaning up generated files..."));
                    if (!(0, fs_1.existsSync)((0, node_path_1.join)(process.cwd(), '../../generated'))) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, node_util_1.promisify)(child_process_1.exec)('rm -rf ../../generated')];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    updatedComponents = [];
                    s = (0, prompts_1.spinner)();
                    s.start('Generating files... Feel free to grab a drink of your choice 🍺');
                    if (!isClean) return [3 /*break*/, 4];
                    return [4 /*yield*/, generate()];
                case 3:
                    updatedComponents = _b.sent();
                    return [3 /*break*/, 7];
                case 4:
                    _a = utils_1.uniqBy;
                    return [4 /*yield*/, getChangedFiles()];
                case 5:
                    changedFiles = _a.apply(void 0, [_b.sent(), 'component']);
                    updateDirs = changedFiles.map(function (file) {
                        var path = (0, node_path_1.join)(process.cwd(), 'src', file.component);
                        if (!(0, fs_1.existsSync)(path)) {
                            throw new Error("Component directory ".concat(path, " does not exist!"));
                        }
                        return {
                            path: path,
                            component: file.component,
                        };
                    });
                    return [4 /*yield*/, generate(updateDirs)];
                case 6:
                    updatedComponents = _b.sent();
                    _b.label = 7;
                case 7:
                    s.stop("[".concat(pc.cyan('@hulla/ui 🤖'), "] Generated files successfully! \u2705"));
                    (0, prompts_1.outro)("[".concat(pc.cyan('@hulla/ui 🤖'), "] Updated the following components: \uD83E\uDD47\n\t").concat(pc.cyan('↪'), " ").concat(pc.cyan(updatedComponents.join('\n\t↪ '))));
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Lists all the changed files inside the packages/ui/src directory.
 * @returns List of modofied/new/deleted files
 */
function getChangedFiles() {
    return __awaiter(this, void 0, void 0, function () {
        var changedFiles, stdout, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    changedFiles = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, execPromise('git status --porcelain | grep packages/ui/src')];
                case 2:
                    stdout = (_a.sent()).stdout;
                    changedFiles = stdout
                        .split('\n')
                        .filter(function (line) { return line.trim() !== ''; })
                        .map(function (line) {
                        return ({
                            path: line.slice(3),
                            component: line.split('/')[3],
                        });
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, changedFiles];
            }
        });
    });
}
/**
 * Runs the generation script on passed values
 * @param onDirs If passed override for only specific directories (see #getChangedFiles), otherwise runs on entire packages/ui/src directory
 * @returns Array of files that were changed
 */
function generate(onDirs) {
    return __awaiter(this, void 0, void 0, function () {
        var changedFiles, _i, onDirs_1, cf, srcDirPath, dirs, _a, dirs_1, dir, dirPath, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    changedFiles = new Set();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 12, , 13]);
                    if (!onDirs) return [3 /*break*/, 6];
                    _i = 0, onDirs_1 = onDirs;
                    _b.label = 2;
                case 2:
                    if (!(_i < onDirs_1.length)) return [3 /*break*/, 5];
                    cf = onDirs_1[_i];
                    changedFiles.add(cf.component);
                    return [4 /*yield*/, generateFromPath(cf.path)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 11];
                case 6:
                    srcDirPath = (0, node_path_1.join)(process.cwd(), 'src');
                    return [4 /*yield*/, (0, promises_1.readdir)(srcDirPath, { withFileTypes: true })];
                case 7:
                    dirs = _b.sent();
                    _a = 0, dirs_1 = dirs;
                    _b.label = 8;
                case 8:
                    if (!(_a < dirs_1.length)) return [3 /*break*/, 11];
                    dir = dirs_1[_a];
                    if (!dir.isDirectory()) return [3 /*break*/, 10];
                    changedFiles.add(dir.name);
                    dirPath = (0, node_path_1.join)(srcDirPath, dir.name);
                    return [4 /*yield*/, generateFromPath(dirPath)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10:
                    _a++;
                    return [3 /*break*/, 8];
                case 11: return [3 /*break*/, 13];
                case 12:
                    error_2 = _b.sent();
                    console.error("Error: ".concat(error_2 instanceof Error ? error_2.message : String(error_2)));
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/, Array.from(changedFiles)];
            }
        });
    });
}
/**
 * The main compiler logic
 * @param dirPath The path to the directory containing the component files.
 */
function generateFromPath(dirPath) {
    return __awaiter(this, void 0, void 0, function () {
        var paths, frameworks, cssCache;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readdir)(dirPath)];
                case 1:
                    paths = _a.sent();
                    frameworks = paths.filter(function (path) { return !path.includes('.') && path !== 'style'; });
                    cssCache = new Map();
                    return [4 /*yield*/, Promise.all(
                        // We map over individual frameworks
                        frameworks.map(function (framework) { return __awaiter(_this, void 0, void 0, function () {
                            var frameworkFiles, indexFile, packageJson, indexFilePath, indexContent, exportLines, relevantFiles, fileExports, componentFiles, didInitialize;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(dirPath, framework))];
                                    case 1:
                                        frameworkFiles = _a.sent();
                                        indexFile = frameworkFiles.find(function (file) { return file.includes('index'); });
                                        return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dirPath, framework, 'package.json'), 'utf-8')
                                            // Validate the folder structure
                                        ];
                                    case 2:
                                        packageJson = _a.sent();
                                        // Validate the folder structure
                                        if (!(0, fs_1.existsSync)((0, node_path_1.join)(dirPath, framework, 'package.json'))) {
                                            throw new Error("No package.json found in ".concat(framework, " directory"));
                                        }
                                        if (!indexFile) {
                                            throw new Error("No index file found in ".concat(framework, " directory"));
                                        }
                                        indexFilePath = (0, node_path_1.join)(dirPath, framework, indexFile);
                                        return [4 /*yield*/, (0, promises_1.readFile)(indexFilePath, 'utf-8')];
                                    case 3:
                                        indexContent = _a.sent();
                                        exportLines = indexContent.split('\n').filter(function (line) { return line.includes('export'); });
                                        if (exportLines.length === 0) {
                                            throw new Error("No export lines found in ".concat(indexFilePath));
                                        }
                                        relevantFiles = frameworkFiles.filter(function (path) { return !path.includes('index') && !path.includes('package.json') && !path.includes('node_modules'); });
                                        fileExports = exportLines.map(function (line) { return line.split('from')[1].trim(); });
                                        if (!relevantFiles.every(function (path) {
                                            return fileExports.some(function (file) { return file.includes(path) || file.includes(path.split('.')[0]); });
                                        })) {
                                            throw new Error("Not all files are exported in ".concat(indexFilePath));
                                        }
                                        return [4 /*yield*/, Promise.all(relevantFiles.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                                                var filePath, content, lines, styleImportIndex, styleImports, styleFrameworks;
                                                var _this = this;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            filePath = (0, node_path_1.join)(dirPath, framework, file);
                                                            return [4 /*yield*/, (0, promises_1.readFile)(filePath, 'utf-8')];
                                                        case 1:
                                                            content = _a.sent();
                                                            lines = content.split('\n');
                                                            styleImportIndex = lines.findIndex(function (line) { return line.includes('../style/tailwind'); });
                                                            if (styleImportIndex === -1) {
                                                                throw new Error("No style imports found in ".concat(filePath));
                                                            }
                                                            styleImports = extractImports(lines[styleImportIndex]);
                                                            if (!styleImports.length) {
                                                                throw new Error("No style imports found in ".concat(filePath));
                                                            }
                                                            // Remove the imoport line from the original file, we no longer need it
                                                            lines.splice(styleImportIndex, 1);
                                                            return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(dirPath, 'style'))
                                                                // Map over individual style frameworks to generate each file
                                                            ];
                                                        case 2:
                                                            styleFrameworks = _a.sent();
                                                            // Map over individual style frameworks to generate each file
                                                            return [2 /*return*/, Promise.all(styleFrameworks.map(function (styleFramework) { return __awaiter(_this, void 0, void 0, function () {
                                                                    var styleFrameworkName, css, cssLines, _loop_1, _i, styleImports_1, styleImport;
                                                                    return __generator(this, function (_a) {
                                                                        switch (_a.label) {
                                                                            case 0:
                                                                                styleFrameworkName = styleFramework.split('.')[0];
                                                                                if (!cssCache.has(styleFrameworkName)) return [3 /*break*/, 1];
                                                                                css = cssCache.get(styleFrameworkName);
                                                                                return [3 /*break*/, 3];
                                                                            case 1: return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dirPath, 'style', styleFramework), 'utf-8')];
                                                                            case 2:
                                                                                css = _a.sent();
                                                                                cssCache.set(styleFrameworkName, css);
                                                                                _a.label = 3;
                                                                            case 3:
                                                                                cssLines = css.split('\n');
                                                                                _loop_1 = function (styleImport) {
                                                                                    var styleImportStart = cssLines.findIndex(function (line) { return line.includes("export const ".concat(styleImport)); });
                                                                                    var styleImportEnd = findClosure(cssLines, styleImportStart);
                                                                                    var styleDeclarationLineIndex = lines.findIndex(function (line) { return line.includes("cn(".concat(styleImport)) || line.includes("vn(".concat(styleImport)); });
                                                                                    if (styleDeclarationLineIndex === -1) {
                                                                                        throw new Error("No style declaration found in ".concat(filePath));
                                                                                    }
                                                                                    var styleValue = extractContentFromClosure(cssLines.slice(styleImportStart, styleImportEnd + 1).join('\n'));
                                                                                    var regex = new RegExp("\\b".concat(styleImport, "\\b"));
                                                                                    console.debug({ cssLines: cssLines, styleImportStart: styleImportStart, styleImportEnd: styleImportEnd, styleValue: styleValue });
                                                                                    lines[styleDeclarationLineIndex] = lines[styleDeclarationLineIndex].replace(regex, styleValue);
                                                                                };
                                                                                // And then we change the code for individual style definitions
                                                                                // this takes the export const = <#def>  value and attaches in in the component definition for the style
                                                                                // i.e. const css = button will be const css = vn({ ... })
                                                                                for (_i = 0, styleImports_1 = styleImports; _i < styleImports_1.length; _i++) {
                                                                                    styleImport = styleImports_1[_i];
                                                                                    _loop_1(styleImport);
                                                                                }
                                                                                return [2 /*return*/, {
                                                                                        content: lines.join('\n'),
                                                                                        name: file.split('.')[0],
                                                                                        framework: framework,
                                                                                        style: styleFrameworkName,
                                                                                    }];
                                                                        }
                                                                    });
                                                                }); }))];
                                                    }
                                                });
                                            }); })).then(function (res) { return res.flat(); })
                                            // Final step, we need to write the updated content to the files to the /generated directory 🎉
                                            // technically not ideal step, but we check for initialization (which means creating index file and package.json)
                                            // for each component sice we need to only do it once
                                        ];
                                    case 4:
                                        componentFiles = _a.sent();
                                        didInitialize = {};
                                        return [2 /*return*/, Promise.all(componentFiles.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                                                var jsonContent, component, generatedDirPath;
                                                var _a, _b;
                                                return __generator(this, function (_c) {
                                                    switch (_c.label) {
                                                        case 0:
                                                            jsonContent = JSON.parse(packageJson);
                                                            component = jsonContent.name.split('.')[0];
                                                            generatedDirPath = (0, node_path_1.join)(process.cwd(), '../../generated', file.framework, file.style, component);
                                                            if (!!((_b = (_a = didInitialize[file.framework]) === null || _a === void 0 ? void 0 : _a[file.style]) === null || _b === void 0 ? void 0 : _b[component])) return [3 /*break*/, 5];
                                                            if (!!(0, fs_1.existsSync)(generatedDirPath)) return [3 /*break*/, 2];
                                                            return [4 /*yield*/, (0, promises_1.mkdir)(generatedDirPath, { recursive: true })];
                                                        case 1:
                                                            _c.sent();
                                                            _c.label = 2;
                                                        case 2: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(generatedDirPath, 'package.json'), packageJson)];
                                                        case 3:
                                                            _c.sent();
                                                            return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(generatedDirPath, "index".concat(jsonContent.extension)), indexContent)];
                                                        case 4:
                                                            _c.sent();
                                                            didInitialize[file.framework] = {};
                                                            didInitialize[file.framework][file.style] = {};
                                                            didInitialize[file.framework][file.style][component] = true;
                                                            _c.label = 5;
                                                        case 5: 
                                                        // And write the updated content to the file
                                                        return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(generatedDirPath, "".concat(file.name).concat(jsonContent.extension)), file.content)];
                                                        case 6:
                                                            // And write the updated content to the file
                                                            _c.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); }))];
                                }
                            });
                        }); }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Extracts the imports for any import statements
 * @param importStatement String of the import statement
 * @returns Array of imports
 * @example extractImports("import { vn, cn } from '@/lib/style'") => ['vn', 'cn']
 */
function extractImports(importStatement) {
    var importRegex = /import\s*{([^}]+)}\s*from\s*['"][^'"]+['"]/;
    var match = importStatement.match(importRegex);
    if (match && match[1]) {
        return match[1].split(',').map(function (item) { return item.trim(); });
    }
    return [];
}
/**
 * Finds the closure of a given code block.
 * @param lines array of lines
 * @param start start index
 * @returns closure end index
 */
function findClosure(lines, start) {
    var bracketStack = {
        '{': 0,
        '(': 0,
    };
    for (var i = start; i < lines.length; i++) {
        var line = lines[i];
        for (var _i = 0, line_1 = line; _i < line_1.length; _i++) {
            var char = line_1[_i];
            if (char === '{') {
                bracketStack['{'] += 1;
            }
            if (char === '}') {
                bracketStack['{'] -= 1;
            }
            if (char === '(') {
                bracketStack['('] += 1;
            }
            if (char === ')') {
                bracketStack['('] -= 1;
            }
        }
        if (bracketStack['{'] === 0 && bracketStack['('] === 0) {
            return i;
        }
    }
    throw new Error('No closure found');
}
/**
 * Extracts the content between the outermost parentheses of a given string.
 * @param str - The input string containing content within parentheses.
 * @returns The extracted content between the outermost parentheses.
 * @throws {Error} If the input string is missing opening or closing parentheses.
 */
function extractContentFromClosure(str) {
    // Find the index of the first opening parenthesis
    var openParenIndex = str.indexOf('(');
    // Find the index of the last closing parenthesis
    var closeParenIndex = str.lastIndexOf(')');
    // Check if both parentheses are found
    if (openParenIndex === -1 || closeParenIndex === -1) {
        throw new Error('Invalid input: missing parentheses');
    }
    // Extract the content between the parentheses
    var content = str.substring(openParenIndex + 1, closeParenIndex);
    // Remove any leading or trailing whitespace
    return content.trim();
}
// This line runs the program: ▷
main();
