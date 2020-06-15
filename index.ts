import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";

function getFilesRecursive(directory, pattern = /\btest\b.*\.(ts|js)$/, rootDirectory = directory, allFiles = []) {
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

export function test(directory) {
    if (directory === ".") {
        directory = "./"
    }
    let files = getFilesRecursive(directory)
    for (let file of files) {
        let relativePath = path.relative(__dirname, path.join(directory, file))
        if (!relativePath.startsWith("/")) {
            relativePath = "./" + relativePath;
        }
        import(relativePath).then(module => {
            console.log(chalk.green(`Passed: ${file}`))
        }).catch(e => {
            console.log(chalk.red(`Failed: ${file}`), e)
        })
    }
}