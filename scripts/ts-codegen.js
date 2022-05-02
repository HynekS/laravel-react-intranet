// @ts-check
const { exec } = require("child_process")
const fs = require("fs")
require("dotenv").config({ path: `../.env` })

const env = process.env
console.log(
  `${env.DB_CONNECTION}://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_HOST}/${env.DB_DATABASE}`,
)

/*
 * The script chokes on "jsxImportSource" option in tsconfig.json
 * However, if no tsconfig is present, it runs fine.
 * My workaround is to temporary rename it…
 * Not ideal, but it works.
 */

fs.renameSync("../tsconfig.json", "../tsconfig.backup.json")

exec(
  `..\\node_modules\\.bin\\schemats generate -c ${env.DB_CONNECTION}://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_HOST}/${env.DB_DATABASE} -o ../resources/js/types/model.ts`,
  function (e, stdout, stderr) {
    if (e) {
      console.log(e, stdout, stderr)
    } else {
      console.log("Types generated successfully")
    }
    fs.renameSync("../tsconfig.backup.json", "../tsconfig.json")
  },
)
