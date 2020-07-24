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
    let urlImages = [];

    // VIDEOS          : data-large-file-url
    // MEDIUM SIZED IMG: data-large-file-url
    // FULL SIZED IMG  : data-file-url

    let articles = document.querySelectorAll("article[data-large-file-url]");

    articles.forEach(article => {
        urlImages.push(article.attributes["data-large-file-url"].value);
    });

    return urlImages;
}

function yandere() {
    let urlImages = [];
    
    // FULL SIZED IMG  : directlink OR largeimg
    // MEDIUM SIZED IMG: data-file-url
    const links = document.querySelectorAll("a[class~='largeimg']");
    links.forEach(link => {
        urlImages.push(link.attributes["href"].value);
    });
    
    return urlImages;
}

function konachan() {
    let liNodes = document.querySelectorAll("li[id^='p']");
    let apiLinks = [];
    let posts = [];
    

    liNodes.forEach(liNode => {
        const id = liNode.attributes["id"].value;
        apiLinks.push(`https://konachan.com/post.json?tags=id:${id.substr(1)}&api_version=2`);
        posts.push(`https://konachan.com/post/show/${id.substr(1)}`);
    });

    return [apiLinks, posts];
}