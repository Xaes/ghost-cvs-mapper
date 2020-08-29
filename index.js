import yargs from "yargs";
import chalk from "chalk";
import Table from "cli-table";
import setupConfig from "./setup/setup";
import setupCSV from "./setup/csv";
import Replacer from "./replacer";
import GhostAdminAPI from "@tryghost/admin-api";
import { printError, printInfo } from "./utils";

(async () => {

    try {

        // Parsing command arguments.

        const argv = yargs.option("config", {
            alias: "c",
            description: "Resets the Ghost Config of the script.",
            type: "boolean",
        }).argv;

        // Setting Up Configuration file and extracting CSV data.

        const config = await setupConfig(argv.config);
        const maps = await setupCSV();

        // Initializing Ghost Admin Client.

        const client = new GhostAdminAPI({
            url: config.ghostUrl,
            key:  config.ghostKey,
            version: "v3"
        });

        // Fetching all posts.

        const posts = (await client.posts.browse({ limit: "all", formats: "html" }))
            .map(post => {
                return {
                    html: post.html,
                    id: post.id,
                    updated_at: post.updated_at,
                    title: post.title,
                    slug: post.slug,
                    url: post.url
                }
            });

        // Initializing Replacer and replacing words with links.

        const replacer = new Replacer(posts, maps);
        replacer.replaceAll();

        // Updating only those Ghost Posts that were modified.

        const updatePromises = replacer.posts
            .filter(post => Object.keys(replacer.summary).includes(post.url))
            .map(post =>
                client.posts.edit(post, { source: "html" }).catch(error => printError(error.message))
            );

        await Promise.all(updatePromises);
        printInfo(`Replacements done. Updated pages: ${updatePromises.length}.`);

        // Printing summary results.

        if(updatePromises.length > 0) {

            printInfo("Summary: ");

            const table = new Table({
                head: ["Page", "Links", "Destinations"].map(h => chalk.green(h))
            })

            // Formatting summary.

            const formattedSum = Object.entries(replacer.summary).map(([key, value]) => {
                return [key, value.length, value.join(",\n")];
            })

            table.push(...formattedSum);
            console.log(table.toString());

        } else printInfo("No updates made.");

    } catch (error) {
        printError(error.message);
        process.exit(1);
    }

})();