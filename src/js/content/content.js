import ImageCollection from "../models/media/ImageCollection.js";
import ImageHTTP from '../models/media/ImageHTTPCollection.js';
import VideoCollection from "../models/media/VideoCollection.js";
// import User from '../models/User.js';

// import Medium from "../models/media/Medium";

export function main() {
    chrome.runtime.onMessage.addListener(function (request, sender, respond) {
        if (request.action == "menuItemClicked") {
            const tabTitle = request.tabTitle;

            if (tabTitle.includes("danbooru")) {
                respond({ collections: danbooru() });
            }
            else if (tabTitle.includes("yande")) {
                respond({ collections: yandere() });
            }
            else if (tabTitle.includes("konachan")) {
                respond({ collections: konachan() });
            }
        }
    });

    function danbooru() {
        const articles = document.querySelectorAll("article:not([class*='blacklisted-active'])");
        const imageCollection = new ImageCollection(false);
        const videoCollection = new VideoCollection(false);

        articles.forEach(article => {
            let urlExtension = article.attributes["data-large-file-url"].value.split('.').pop();
            const id = article.attributes["data-id"].value;

            if ((urlExtension == "mp4") || (urlExtension == "webm")) {
                // video
                videoCollection.addVideoLink(article.attributes["data-large-file-url"].value);
                videoCollection.addPost(`https://danbooru.donmai.us/posts/${id}`);
                videoCollection.addId(id);
            }
            else {
                // image
                imageCollection.addimageLink(article.attributes["data-large-file-url"].value);
                imageCollection.addPost(`https://danbooru.donmai.us/posts/${id}`);
                imageCollection.addId(id);
            }
        });

        return {
            imageCollection: imageCollection,
            videoCollection: videoCollection
        };
    }

    function yandere() {
        const images = [];
        const posts = [];
        const ids = [];

        const anchors = document.querySelectorAll("a[class~='largeimg']");
        const lists = document.querySelectorAll("li[id^='p']:not([class*='hide'])");

        for (let i = 0; i < anchors.length; i++) {
            const id = lists[i].attributes["id"].value;

            images.push(anchors[i].attributes["href"].value);
            posts.push(`https://yande.re/post/show/${id.substr(1)}`);
            ids.push(id);
        }

        return [images, posts, ids];
    }

    function konachan() {
        const lists = document.querySelectorAll("li[id^='p']:not([class*='hide'])");
        const apiLinks = [];
        const posts = [];
        const ids = [];

        lists.forEach(list => {
            const id = list.attributes["id"].value.substr(1);

            apiLinks.push(`https://konachan.com/post.json?tags=id:${id}&api_version=2`);
            posts.push(`https://konachan.com/post/show/${id}`);
            ids.push(id);
        });

        return [apiLinks, posts, ids];
    }

    // const user = User.new({ name: 'otiai20' });
    // console.log(user.greet());
    // console.log(
    //     "Is chrome.runtime available here?",
    //     typeof chrome.runtime.sendMessage == "function"
    // );

    const imageCollection = new ImageCollection();
    imageCollection.addId(1337);
    // console.log(image.ids[0]);
    console.log(imageCollection.getIds()[0]);

    // const mediaum = new Medium();

}

