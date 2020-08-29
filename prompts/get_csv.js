import inquirer from "inquirer";

const prompt = (options) => inquirer.prompt([
    { name: "selectedCSV", type: "list", choices: options, message: "Select a CSV to use: "}
])

export default prompt;