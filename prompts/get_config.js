import inquirer from "inquirer";
import { validateKey, validateUrl, formatUrl } from "../utils";

const prompt = () => inquirer.prompt([
    { name: "ghostUrl", message: "Insert your Ghost URL: ", validate: validateUrl, filter: formatUrl },
    { name: "ghostKey", message: "Insert your Ghost API Key: ", validate: validateKey }
])

export default prompt;