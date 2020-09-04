import { parse, TextNode } from "node-html-parser";
import { formatUrl } from "../utils";

export default class Replacer {

    constructor(posts, map) {
        this.posts = posts;
        this.map = map;
        this.summary = {};
    }

    replaceAll() {
        this.posts = this.posts.map(post => {
            return {
                ...post,
                html: this._replacePost(post)
            }
        });
    }

    _replacePost(post) {
        const root = parse(post.html);
        return this._replaceNodes(root, post).toString();
    }

    _replaceNodes(root, post) {

        // Recursive function:
        // - If the current child node is a TextNode (only contains text) find/replace the text by links.
        // - If the current child node is a "p" tag call this same function to search for more text nodes.
        // - Else return the same node.

        if(root && root.childNodes) {
            root.childNodes = root.childNodes.map(child => {
                if (child instanceof TextNode && !child.isWhitespace) {
                    return this._replaceText(child, post);
                } else if (child.tagName && child.tagName === "p") {
                    return this._replaceNodes(child, post);
                } else {
                    return child;
                }
            })
        }

        return root;

    }

    _replaceText(textNode, post) {

        let text = textNode.text;

        // Replacing each entry found on the text node.

        this.map.forEach(map => {

            // Don't replace if:
            // - Post is already on summary object (Prevents to add more than one link per post).
            // - If both URL's are the same (Prevents to insert a link that points to the same post).
            // - If the URL of the current row of CSV is already present on the HTML string (Prevents to insert a link
            //   if there is already another link that points to it).

            if (
                (this.summary[post.url] && this.summary[post.url].includes(map.url)) ||
                formatUrl(map.url) === formatUrl(post.url) ||
                post.html.indexOf(formatUrl(map.url)) >= 0
            ) return;

            const primaryExp = this._buildRegex(map.primary);
            const secondaryExp = this._buildRegex(map.secondary);

            // If there is no pattern found with the first Regex, find and replace the
            // with second regular expression in the same text node.

            const oldText = text;

            if(primaryExp.test(text)) text = text.replace(primaryExp, `<a href='${map.url}'>$2</a>`);
            else text = text.replace(secondaryExp, `<a href='${map.url}'>$2</a>`);

            // Verify if a replacement was made.

            if(text !== oldText) this._registerReplacement(post, map.url);

        })

        // Since we inserted HTML links in the string we need to call the HTML
        // parser again in order to generate the new nodes.

        return parse(text);

    }

    _registerReplacement(post, mapUrl) {

        const postUrl = post.url;

        if(this.summary[postUrl]) {
            if(!this.summary[postUrl].includes(mapUrl)) {
                this.summary[postUrl].push(mapUrl);
            }
        } else this.summary[postUrl] = [mapUrl];

    }

    _buildRegex(word) {
        return new RegExp(`(?! <("[^"]*?"|'[^']*?'|[^'">])*>)(\\b${word}+\\b)`, "i");
    }

}