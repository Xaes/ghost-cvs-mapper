import csv from "csv-parser";
import fs from "fs";
import fsPromise from "fs/promises";
import prompt from "../prompts/get_csv";
import stripBomStream from "strip-bom-stream";
import { printError, printInfo } from "../utils";

export default async () => {

    const csvDir = "./csv/";
    const dirFiles = (await fsPromise.readdir(csvDir)).filter(f => f.endsWith(".csv"));

    // Checking if there are not CSV files on directory.

    if(!dirFiles.length > 0) {
        printError(`No CSV files found under CSV folder.`);
        process.exit(1);
    }

    // Wait for user to input a selected CSV.

    const selectedCSV = (await prompt(dirFiles)).selectedCSV;
    const relativePath = csvDir + selectedCSV;

    return new Promise((resolve, reject) => {

        let data = [];

        fs.createReadStream(relativePath)
            .on("error", error => reject(error))
            .pipe(stripBomStream())
            .pipe(csv())
            .on("data", row => {
                data.push({
                    url: row["URL"],
                    primary: row["primary keyword"],
                    secondary: row["secondary keyword"]
                });
            })
            .on("end", () => {
                printInfo(`CSV file successfully processed (${selectedCSV}).`);
                resolve(data);
            });

    })
    .catch(error => printError(error.message))

}