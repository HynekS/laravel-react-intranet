// @ts-check
const { exec } = require("child_process")
require("dotenv").config({ path: `../.env` })

const env = process.env

exec(
  `schemats generate -c ${env.DB_CONNECTION}://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_HOST}/${env.DB_DATABASE} -o ../resources/js/types/model.ts`,
)
