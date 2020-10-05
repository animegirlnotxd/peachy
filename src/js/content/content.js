import Video from "../models/media/Video.js";
import Image from "../models/media/Image.js";
import VisualCollection from "../models/media/VisualCollection.js";

export function main() {
    chrome.runtime.onMessage.addListener(function (request, sender, respond) {
        if (request.action === "menuItemClicked") {
            const tabTitle = request.tabTitle;

            if (tabTitle.includes("danbooru")) {
                respond({ collection: danbooru() });
            }
            else if (tabTitle.includes("yande")) {
                respond({ collection: yandere() });
            }
            else if (tabTitle.includes("konachan")) {
                respond({ collection: konachan() });
            }
        }
    });



    function danbooru() {
        const visualCollection = new VisualCollection();
        const articles = document.querySelectorAll("article:not([class*='blacklisted-active'])");

        articles.forEach(article => {
            const extension = article.attributes["data-large-file-url"].value.split('.').pop();
            const id = article.attributes["data-id"].value;
            const link = article.attributes["data-large-file-url"].value;
            const post = `https://danbooru.donmai.us/posts/${id}`;

            if ((extension === "mp4") || (extension === "webm")) {
                // video
                const video = new Video(link, id, post, false);
                visualCollection.addVisual(video);
            }
            else {
                // image
                const image = new Image(link, id, post, false);
                visualCollection.addVisual(image);
            }
        });

        return visualCollection;
    }

    function yandere() {
        const visualCollection = new VisualCollection();
        const anchors = document.querySelectorAll("a[class~='largeimg']");
        const lists = document.querySelectorAll("li[id^='p']:not([class*='hide'])");

        for (let i = 0; i < anchors.length; i++) {
            const extension = anchors[i].attributes["href"].value.split('.').pop();
            const id = lists[i].attributes["id"].value;
            const link = anchors[i].attributes["href"].value;
            const post = `https://yande.re/post/show/${id.substr(1)}`;

            if ((extension === "mp4") || (extension === "webm")) {
                // video
                const video = new Video(link, id, post, false);
                visualCollection.addVisual(video);
            }
            else {
                // image
                const image = new Image(link, id, post, false);
                visualCollection.addVisual(image);
            }
        }

        return visualCollection;
    }

    function konachan() {
        const visualCollection = new VisualCollection();
        const lists = document.querySelectorAll("li[id^='p']:not([class*='hide'])");

        lists.forEach(list => {
            const id = list.attributes["id"].value.substr(1);
            const link = `https://konachan.com/post.json?tags=id:${id}&api_version=2`;
            const post = `https://konachan.com/post/show/${id}`;

            const image = new Image(link, id, post, false);
            visualCollection.addVisual(image);
        });

        return visualCollection;
    }
}

