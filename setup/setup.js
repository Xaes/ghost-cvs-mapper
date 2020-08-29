import fs from "fs";
import fsPromise from "fs/promises";
import getConfig from "../prompts/get_config";
import { printInfo, printError } from "../utils";

export default async (forceConfig = false) => {

    const CONFIG_FILE = "config.json";

    // Check if file exists.

    return await fsPromise.access(CONFIG_FILE, fs.constants.F_OK | fs.constants.W_OK)
        .catch(async error => {

            if(error.code === "ENOENT") {

                // Create file if it does not exists.

                printInfo(`Config file does not exists. Automatically creating one (${CONFIG_FILE}).`)
                await fsPromise.writeFile(CONFIG_FILE, JSON.stringify({
                    ghostKey: "",
                    ghostUrl: ""
                }, null, 2));

            } else if(error.code === "EACCES") {

                // Configuration file is not writable.

                printError(`Config file is not writable (${CONFIG_FILE}).`);
                process.exit(1);

            }

        })
        .then(async () => {

            const stringBuffer = await fsPromise.readFile(CONFIG_FILE);
            let config = JSON.parse(stringBuffer.toString());

            // Check if any value within the config file is empty.

            if(Object.values(config).some(o => o === "" || o === null) || forceConfig) {

                // Get new configuration from input.

                printInfo(`Configuration file is empty or is being reset.`);
                config = await getConfig();

                // Save it to the same JSON Config file.

                await fsPromise.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));

            }

            printInfo(`Ghost URL set to (${config.ghostUrl}).`);
            return config;

        });

}