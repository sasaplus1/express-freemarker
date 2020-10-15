// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 7016
import { default as FreeMarker } from 'freemarker.js';

/**
 * render engine
 *
 * @param filePath
 * @param options
 * @param data
 * @param callback
 */
export function engine(
  filePath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>,
  callback: (err: Error | null, html: string, output: string) => void
): void {
  const renderer = new FreeMarker(options);

  renderer.render(filePath, data, function (
    err: Error | null,
    html: string,
    output: string
  ) {
    if (err) {
      return callback(err, '', output);
    }

    callback(null, html, output);
  });
}
