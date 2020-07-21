chrome.runtime.onMessage.addListener(function(request, sender, respond) {	
	if (request.action == "menuItemClicked") {
        let tabTitle = request.tabTitle;
        
        if(tabTitle.includes("danbooru")) {
            respond({urls : danbooru()});
        }
        else if (tabTitle.includes("yande")) {
            respond({urls : yandere()});
        }
        else if(tabTitle.includes("konachan")) {
            respond({urls : konachan()});
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
    let links = document.querySelectorAll("a[class~='largeimg']");
    links.forEach(link => {
        urlImages.push(link.attributes["href"].value);
    });
    return urlImages;
}

function konachan() {
    let urlImages = [];
    let prefix = "https://konachan.com";
    let linkToMediumImagePage;

    let links = document.querySelectorAll("a[class~='thumb']");
    
    links.forEach(link => {
        linkToMediumImagePage = `${prefix}${link.attributes["href"].value}`;
    });

    fetch(linkToMediumImagePage)
            .then(function(response) {
                return response.text();
            })
            .then(function(html) {
                let parser = new DOMParser();    
                let doc = parser.parseFromString(html, "text/html");
                console.log(doc.querySelectorAll('img')[2].src);
                urlImages.push(doc.querySelectorAll('img')[2].src);
            })
            .catch(function(err) {
                console.log('Failed to fetch page: ', err);  
            });

    console.log("LENGTH: " + urlImages.length);
    return urlImages;
}