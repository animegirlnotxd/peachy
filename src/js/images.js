chrome.runtime.onMessage.addListener(function listener(request) {
    // needed, otherwise images sent from the background script get loaded in again...
    chrome.runtime.onMessage.removeListener(listener);
    populateImagesPage(request.collections.collections, request.tabTitle);
    applyTitle(request.tabTitle);
});

document.getElementById('column-count').addEventListener('input', updateValue);
window.addEventListener('DOMContentLoaded', () => {
	/*
	if(urls == undefined) {
		$("#info").html("Either this page wasn't opened through the normal use of the extension;<br>or a window reload occured and it cleared the fetched images.");
		$("#info").css({
			"border-left": "2px solid #FFB818"
		});
	}*/
});

function updateValue(e) {
    const value = e.target.value;
    const columnCountOutput = document.getElementById('column-count-output');

    columnCountOutput.textContent = value;
    document.getElementById("content").style.columnCount = value;
}

function populateImagesPage(collections, tabTitle) {
    // console.log(collections);
    const amount = collections.imageCollection._ids.length + collections.videoCollection._ids.length;

    document.getElementById('image-count').innerText = amount + " images / videos ";

    switch (determineSite(tabTitle)) {
        case "danbooru":
            danbooru(collections);
            break;
        case "yandere":
            yandere(collections);
            break;
        case "konachan":
            konachan(collections);
            break;
        default:
            break;
    }
}

function determineSite(tabTitle) {
    if (tabTitle.includes("danbooru")) {
        return "danbooru";
    }
    else if (tabTitle.includes("yande")) {
        return "yandere";
    }
    else if (tabTitle.includes("konachan")) {
        return "konachan";
    }
}

function applyTitle(tabTitle) {
    if (determineSite(tabTitle) == "danbooru") {
        document.title = "Results from danbooru";
    }
    else if (determineSite(tabTitle) == "yandere") {
        document.title = "Results from yandere";
    }
    else if (determineSite(tabTitle) == "konachan") {
        document.title = "Results from konachan";
    }
}



function danbooru(collections) {
    // console.log(collections);
    for (let i = 0; i < collections.imageCollection._ids.length; i++) {
        document.getElementById('content').append(
            createNode(collections.imageCollection._imageLinks[i],
                collections.imageCollection._posts[i],
                collections.imageCollection._ids[i])
        );
    }
}

function yandere(urls) {
    for (let i = 0; i < urls[0].length; i++) {
        setInterval(() => {
            document.getElementById('content').append(
                createNode(urls[0][i], urls[1][i], urls[2][i])
            );
        }, 1500);
    }

    // for (let i = 0; i < urls[0].length; i++) {
    // 	document.getElementById('content').append(
    // 		createNode(urls[0][i], urls[1][i], urls[2][i])
    // 	);
    // }
}

function konachan(urls) {
    let promises = [];
    urls[0].forEach(url => {
        promises.push(
            fetch(url)
                .then((response) => response.json()));
    });

    Promise.all(promises).then((values) => {
        for (let i = 0; i < values.length; i++) {
            document.getElementById('content').append(
                createNode(values[i].posts[0]['sample_url'], urls[1][i], urls[2][i])
            );
        }
    });
}

function createNode(url, post, id) {
    let content;
    let urlExtension = url.split('.').pop();

    if ((urlExtension == "mp4")
        || (urlExtension == "webm")) {
        const video = document.createElement('video');
        video.controls = true;
        video.loop = true;
        video.muted = true;

        const video2 = document.createElement('video');
        video2.controls = true;
        video2.loop = true;
        video2.muted = true;

        const source = document.createElement('source');
        source.setAttribute('src', url);

        const source2 = document.createElement('source');
        source2.setAttribute('src', url);

        video.appendChild(source);
        video2.appendChild(source2);

        const a = document.createElement('a');
        a.setAttribute('href', post);
        a.setAttribute('id', "open");
        a.setAttribute('target', "_blank");

        const underlay = document.createElement('a');
        underlay.setAttribute('data-href', `#${id}`);
        underlay.addEventListener('click', e => {
            window.location.href = underlay.dataset.href;
        });
        underlay.appendChild(video);

        const overlay = document.createElement('a');
        overlay.setAttribute('href', "#_");
        overlay.setAttribute('class', "overlay");
        overlay.setAttribute('id', id);
        overlay.appendChild(video2);

        const article = document.createElement('article');
        article.appendChild(underlay);
        article.appendChild(overlay);
        article.appendChild(a);

        content = article;
    }
    else {
        const img = document.createElement('img');
        img.setAttribute('src', url);

        const img2 = document.createElement('img');
        img2.setAttribute('src', url);

        const postLink = document.createElement('a');
        postLink.setAttribute('href', post);
        postLink.setAttribute('id', "open");
        postLink.setAttribute('target', "_blank");

        const favorite = document.createElement('a');
        favorite.setAttribute('href', post);
        favorite.setAttribute('id', "favorite");
        favorite.setAttribute('target', "_blank");

        const underlay = document.createElement('a');
        underlay.setAttribute('data-href', `#${id}`);

        // source: https://stackoverflow.com/a/63095737/13978779
        underlay.addEventListener("click", e => {
            window.location.href = underlay.dataset.href;
        });

        underlay.appendChild(img);

        const overlay = document.createElement('a');
        overlay.setAttribute('href', "#_");
        overlay.setAttribute('class', "overlay");
        overlay.setAttribute('id', id);
        overlay.appendChild(img2);

        const article = document.createElement('article');
        article.appendChild(underlay);
        article.appendChild(overlay);
        article.appendChild(postLink);
        article.appendChild(favorite);

        content = article;
    }

    return content;
}