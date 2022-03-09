"use strict"

const fs = require("fs")
const path = require('path')
const mkdirp = require("mkdirp")
const EFS_MOUNT = "/mnt/efs/"
const EFS_PATH = process.env.EFS_PATH
const AWS = require("aws-sdk")

module.exports.copytoefs = (event) => {
  console.log("Received S3 event:", JSON.stringify(event, null, 2))

  let s3 = new AWS.S3()

  // Iterate all files
  for (let index = 0; index < event.Records.length; index++) {

    // Obtain file bucket name and key string
    let file2copy = {
      Bucket: event.Records[index].s3.bucket.name,
      Key: decodeURIComponent(event.Records[index].s3.object.key.replace(/\+/g, " ")),
    }

    // parse the file path in the s3 bucket and use mkdirp to create the same path on the efs

    // from /path/to/file, obtain fileName=file and s3DirPath=/path/to
    // alternatively with regex: \/(.+\/)*(.+) and file2copy.Key.match(re)
    let fileName = path.posix.basename(file2copy.Key)
    let s3DirPath = path.dirname(file2copy.Key)

    let fullPath = EFS_PATH
      ? `${EFS_MOUNT}${EFS_PATH}/${s3DirPath}`
      : `${EFS_MOUNT}${s3DirPath}`
    fullPath = fullPath.replace(/\/\//g, "/")
    mkdirp.sync(fullPath)
    let filePath = `${fullPath}/${fileName}`.replace(/\/\//g, "/")
    console.info(`Uploading ${file2copy.Key} from ${file2copy.Bucket} to EFS in the path: ${filePath}.`)

    // write to stream
    let writeStream = fs.createWriteStream(filePath)
    let readStream = s3.getObject(file2copy).createReadStream()

    readStream.on("error", function (err) {
      console.error("Read error:", err)
    })
    readStream.pipe(writeStream)
      .on("error", function (err) {
        console.error("Error when writing to stream: ", err)
      })
      .on("close", function () {
        console.log("Copy complete")
      })
  }
  return { message: "Function ran successfully" }
}