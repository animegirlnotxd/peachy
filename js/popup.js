window.onload=function() {
    document.getElementById('back').addEventListener('click', goBack);    
    document.getElementById('logo').addEventListener('click', function(e) {
        if (e.ctrlKey) {
            openWebsites();
        }
        else if (e.shiftKey) {
            loadSitesIntoTextarea();
        }
    })
}

let urls;
let isCorrectPassword = false;

if(localStorage["urls"] != undefined) {
    urls = localStorage.getItem("urls").split(',');
}
else {
    let initialUrls = [
        "https://danbooru.donmai.us/posts?d=1&tags=order%3Arank",
        "https://yande.re/post/popular_recent",
        "https://konachan.com/post/popular_recent",
        "https://gelbooru.com/index.php?page=post&s=list",
        "https://www.sex.com/",
        "https://pornopics.co/"
    ];

    localStorage.setItem("urls", initialUrls);
}

document.getElementById('amountOfSites').innerHTML = `${urls.length} sites`;

function openWebsites() {
    for (let i = 0; i < urls.length; i++) {
        let url = urls[i];
        if (url !== '')
        {
            chrome.tabs.create({
                url: url,
                active: false
            });
        }
    }  
}

function loadSitesIntoTextarea() {
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "initial";
    document.body.style.width = "469px";

    document.getElementById('urls').value = "";
    urls.forEach(element => {
        document.getElementById('urls').value += element + "\n";
    });
}

function goBack() {
    document.getElementById("page1").style.display = "initial";
    document.getElementById("page2").style.display = "none";
    document.body.style.width = "initial";
}