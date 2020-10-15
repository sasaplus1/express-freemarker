/**
 * render engine
 *
 * @param filePath
 * @param options
 * @param data
 * @param callback
 */
export declare function engine(filePath: string, options: Record<string, any>, data: Record<string, any>, callback: (err: Error | null, html: string, output: string) => void): void;
