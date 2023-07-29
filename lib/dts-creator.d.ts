import { DtsContent, CamelCaseOption } from './dts-content';
import { Plugin } from 'postcss';
interface DtsCreatorOptions {
    rootDir?: string;
    searchDir?: string;
    outDir?: string;
    camelCase?: CamelCaseOption;
    namedExports?: boolean;
    dropExtension?: boolean;
    EOL?: string;
    loaderPlugins?: Plugin<any>[];
}
export declare class DtsCreator {
    private rootDir;
    private searchDir;
    private outDir;
    private loader;
    private inputDirectory;
    private outputDirectory;
    private camelCase;
    private namedExports;
    private dropExtension;
    private EOL;
    constructor(options?: DtsCreatorOptions);
    create(filePath: string, initialContents?: string, clearCache?: boolean): Promise<DtsContent>;
}
export {};