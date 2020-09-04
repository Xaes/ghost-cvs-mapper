import chalk from "chalk";

export const printInfo = (message) => {
    return console.log(chalk.blue(`[INFO]: ${message}`));
}

export const printError = (message) => {
    return console.log(chalk.red(`[ERROR]: ${message}`));d
}

export const formatUrl = (url) => {
    if(url && url.endsWith("/")) return url.substr(0, url.length - 1);
    else return url;
}

export const validateUrl = (url) => {
    if(url && /https?:\/\//.test(url)) return true;
    else return chalk.red(`[ERROR]: URL must not be empty and requires a protocol. E.g. 'https://site.com'`);
}

export const validateKey = (key) => {
    if(key && /[0-9a-f]{24}:[0-9a-f]{64}/.test(key)) return true;
    else return chalk.red(`[ERROR]: Key must not be empty and it must have the following format {A}:{B}, where A is 24 hex characters and B is 64 hex characters`);
}