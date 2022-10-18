import { readFile, writeFile } from "fs/promises";
import { Parser } from "xml2js";
const parser = new Parser({ attrkey: "ATTR" });

// First command line argument
const schemaFile = process.argv[process.argv.length - 2];

// First command line argument
const targetFile = process.argv[process.argv.length - 1];

const schemaSource = await readFile(schemaFile, "utf-8");

const convertedSchema = await parser.parseStringPromise(schemaSource);

await writeFile(targetFile, JSON.stringify(convertedSchema), "utf-8");
