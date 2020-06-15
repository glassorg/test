import * as fs from "fs";
import * as path from "path";

function getFilesRecursive(directory, pattern = /\btest\b.*\.js$/, rootDirectory = directory, allFiles = []) {
    for (let name of fs.readdirSync(directory)) {
        let filename = path.join(directory, name)
        let fileInfo = fs.statSync(filename)
        if (fileInfo.isFile()) {
            let relativeFilename = path.relative(rootDirectory, filename)
            console.log({ relativeFilename })
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

export function test(directory) {
    console.log("test function")
    let files = getFilesRecursive(directory)
    for (let file of files) {
        console.log("file: " + file)
        let relativePath = path.relative(__dirname, path.join(directory, file))
        require(relativePath)
    }
}