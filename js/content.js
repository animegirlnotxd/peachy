chrome.runtime.onMessage.addListener(function(request, sender, respond) {	
	if (request.action == "menuItemClicked") {
        let tabTitle = request.tabTitle;
        
        if(tabTitle.includes("danbooru")) {
            respond({urls: danbooru()});
        }
        else if (tabTitle.includes("yande")) {
            respond({urls: yandere()});
        }
        else if(tabTitle.includes("konachan")) {
            respond({urls: konachan()});
        }
    }
});

function danbooru() {
    let articles = document.querySelectorAll("article:not([class*='blacklisted-active'])");
    
    const images = [];
    const posts = [];
    const ids = [];
    
    articles.forEach(article => {
        const id = article.attributes["data-id"].value;

        images.push(article.attributes["data-large-file-url"].value);
        posts.push(`https://danbooru.donmai.us/posts/${id}`);
        ids.push(id);
    });

    return [images, posts, ids];
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