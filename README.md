# Ghost URL Mapper

A CLI tool that maps string phrases across all Ghost CMS posts and replaces them by a link using the Ghost Admin SDK.

## How to use

1. [Install Node JS](https://nodejs.org/en/download/) (Tested with Node v.14).
2. [Install Yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable).
3. Within a console navigate to the script's directory and execute **`yarn install`** to install project's dependencies.
4. Place your CSV files under the **`csv/`** directory. CSV's must have this header structure: **`URL,primary keyword,secondary keyword`**.
5. Go to your Ghost Dashboard, click on "Integrations", and then "Add Custom Integration", give it any name you want.
6. Run **`yarn run start`**.
7. If there is no configuration value or file set, the CLI will automatically ask for an API Key and an API URL that can be found on the Integration you created on step 5.
8. The CLI will ask for which CSV file to use.

A summary table will be displayed if there were updates made to your posts.
 
*NOTE: You may use*  **`yarn run resetConfig`** *to reset your Ghost Configuration. Removing the config.json or leaving one of its values null or empty will prompt for the configuration again. Also, if the config file is read-only the script will throw an error.* 

*NOTE: If there isn't a CSV file under the* **`csv/`** *directory the script will close before connecting to Ghost.*