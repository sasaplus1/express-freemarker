"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.engine = void 0;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 7016
var freemarker_js_1 = __importDefault(require("freemarker.js"));
/**
 * render engine
 *
 * @param filePath
 * @param options
 * @param data
 * @param callback
 */
function engine(filePath, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
options, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
data, callback) {
    var renderer = new freemarker_js_1.default(options);
    renderer.render(filePath, data, function (err, html, output) {
        if (err) {
            return callback(err, '', output);
        }
        callback(null, html, output);
    });
}
exports.engine = engine;
//# sourceMappingURL=index.js.map