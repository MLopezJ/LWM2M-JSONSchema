import { execSync } from "child_process";
import { readFileSync } from "fs";

describe("xml2js-cli", () => {
  it("should write a Schema file from JSON", () => {
    execSync("npx tsx ./xml2js-cli.ts ./1.xml ./1.json");
    const writtenSchema = readFileSync("./1.json", "utf-8");
    const expectedSchema = {}; // FIXME
    expect(JSON.parse(writtenSchema)).toEqual(expectedSchema);
  });
});
