import { test } from "./index"

const [,,dir] = process.argv
if (dir == null) {
    console.log(`\nUsage: gtest [-w] directory\n\n`)
    process.exit(1)
}
else {
    test(dir)
}