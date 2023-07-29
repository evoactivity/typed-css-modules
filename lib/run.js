"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const path = __importStar(require("path"));
const util = __importStar(require("util"));
const chalk_1 = __importDefault(require("chalk"));
const chokidar = __importStar(require("chokidar"));
const glob_1 = __importDefault(require("glob"));
const dts_creator_1 = require("./dts-creator");
const glob = util.promisify(glob_1.default);
async function run(searchDir, options = {}) {
    const filesPattern = path.join(searchDir, options.pattern || '**/*.css');
    const creator = new dts_creator_1.DtsCreator({
        rootDir: process.cwd(),
        searchDir,
        outDir: options.outDir,
        camelCase: options.camelCase,
        namedExports: options.namedExports,
        dropExtension: options.dropExtension,
    });
    const checkFile = async (f) => {
        try {
            const content = await creator.create(f, undefined, false);
            return await content.checkFile();
        }
        catch (error) {
            console.error(chalk_1.default.red(`[ERROR] An error occurred checking '${f}':\n${error}`));
            return false;
        }
    };
    const writeFile = async (f) => {
        try {
            const content = await creator.create(f, undefined, !!options.watch);
            await content.writeFile();
            if (!options.silent) {
                console.log('Wrote ' + chalk_1.default.green(content.outputFilePath));
            }
        }
        catch (error) {
            console.error(chalk_1.default.red('[Error] ' + error));
        }
    };
    if (options.listDifferent) {
        const files = await glob(filesPattern);
        const hasErrors = (await Promise.all(files.map(checkFile))).includes(false);
        if (hasErrors) {
            process.exit(1);
        }
        return;
    }
    if (!options.watch) {
        const files = await glob(filesPattern);
        await Promise.all(files.map(writeFile));
    }
    else {
        console.log('Watch ' + filesPattern + '...');
        const watcher = chokidar.watch([filesPattern.replace(/\\/g, '/')]);
        watcher.on('add', writeFile);
        watcher.on('change', writeFile);
        await waitForever();
    }
}
exports.run = run;
async function waitForever() {
    return new Promise(() => { });
}
//# sourceMappingURL=run.js.map