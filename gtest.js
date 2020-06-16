#!/usr/bin/env node
import { test } from "./index.js"
const red = text => `\x1b[31m${text}\x1b[0m`
const green = text => `\x1b[32m${text}\x1b[0m`

const [,,dir] = process.argv
if (dir == null) {
    console.log(`\nUsage: gtest directory\n\n`)
    process.exit(1)
}
else {
    test(
        dir,
        (test, error) => {
            if (error) {
                console.log(red(`Failed: ${test}`), error)
            }
            else {
                console.log(green(`Passed: ${test}`))
            }
        },
        (pass, fail) => {
            let total = pass + fail
            console.log(green(`Passed ${pass}/${total}`))
            if (fail > 0) {
                console.log(red(`Failed ${fail}/${total}`))
            }
            process.exit(Math.sign(fail))
        }
    )
}