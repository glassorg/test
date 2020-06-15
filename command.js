import { test } from "./index.js"

const [,,dir] = process.argv
if (dir == null) {
    console.log(`\nUsage: gtest directory\n\n`)
    process.exit(1)
}
else {
    test(dir)
}