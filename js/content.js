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
    // VIDEOS          : data-large-file-url
    // MEDIUM SIZED IMG: data-large-file-url
    // FULL SIZED IMG  : data-file-url

    let articles = document.querySelectorAll("article");
    
    let links = [];
    let posts = [];
    
    articles.forEach(article => {
        links.push(article.attributes["data-large-file-url"].value);

        const id = article.attributes["data-id"].value;
        posts.push(`https://danbooru.donmai.us/posts/${id}`);
    });

    return [links, posts];
}

function yandere() {
    let links = [];
    let posts = [];

    const anchors = document.querySelectorAll("a[class~='largeimg']");
    const lists = document.querySelectorAll("li[id^='p']");

    for (let i = 0; i < anchors.length; i++) {
        links.push(anchors[i].attributes["href"].value);

        const id = lists[i].attributes["id"].value;
        posts.push(`https://yande.re/post/show/${id.substr(1)}`);
    }

    return [links, posts];
}

function konachan() {
    let lists = document.querySelectorAll("li[id^='p']");
    let apiLinks = [];
    let posts = [];
    
    lists.forEach(list => {
        const id = list.attributes["id"].value;
        apiLinks.push(`https://konachan.com/post.json?tags=id:${id.substr(1)}&api_version=2`);
        posts.push(`https://konachan.com/post/show/${id.substr(1)}`);
    });

    return [apiLinks, posts];
}