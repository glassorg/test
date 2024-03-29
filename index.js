import * as fs from "fs";
import * as path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { isAsyncFunction } from "util/types";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function getFilesRecursive(directory, pattern = /\btest\b.*\.js$/, rootDirectory = directory, allFiles = []) {
    for (let name of fs.readdirSync(directory)) {
        let filename = path.join(directory, name)
        let fileInfo = fs.statSync(filename)
        if (fileInfo.isFile()) {
            let relativeFilename = path.relative(rootDirectory, filename)
            if (pattern.test(relativeFilename)) {
                allFiles.push(relativeFilename)
            }
        }
        else {
            getFilesRecursive(filename, pattern, rootDirectory, allFiles)
        }
    }
    return allFiles
}

export function test(directory, callback, finished = (pass = 0, fail = 0) => {}) {
    let files = getFilesRecursive(directory)
    let pass = 0
    let fail = 0
    function maybeDone() {
        if ((pass + fail) === files.length) {
            finished(pass, fail)
        }
    }
    for (let file of files) {
        let relativePath = path.join(directory, file)
        let importPath = path.relative(__dirname, relativePath)
        if (!importPath.startsWith("/")) {
            importPath = "./" + importPath;
        }
        import(importPath).then(module => {
            (async () => {
                // see if there are any async functions exported.
                for (let name in module) {
                    let value = module[name];
                    if (typeof value === "function" && value.length === 0) {
                        try {
                            isAsyncFunction(value) ? await value() : value();
                        }
                        catch (e) {
                            fail++
                            callback(`${relativePath}#${name}()`, e)
                            maybeDone()
                            return;
                        }
                    }
                }
                pass++
                callback(relativePath)
                maybeDone()
            })();
        }).catch(e => {
            fail++
            callback(relativePath, e)
            maybeDone()
        })
    }
}