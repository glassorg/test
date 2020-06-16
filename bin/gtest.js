#!/usr/bin/env node
import { test } from "../index.js"
import chalk from "chalk"

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
                console.log(chalk.red(`Failed: ${test}`), error)
            }
            else {
                console.log(chalk.green(`Passed: ${test}`))
            }
        },
        (pass, fail) => {
            let total = pass + fail
            console.log(chalk.green(`Passed ${pass}/${total}`))
            if (fail > 0) {
                console.log(chalk.red(`Failed ${fail}/${total}`))
            }
            process.exit(Math.sign(fail))
        }
    )
}