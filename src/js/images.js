chrome.runtime.onMessage.addListener(
    function listener(request) {

        // needed, otherwise images sent from the background script get loaded in again...
        chrome.runtime.onMessage.removeListener(listener);

        populateImagesPage(request.collection, request.tabTitle);
        applyTitle(request.tabTitle);
        document.getElementById('download-all').addEventListener('click', () => {
            downloadAll(request.collection);
        });
    });

document.getElementById('column-count').addEventListener('input', updateColumnCounter);

function updateColumnCounter(e) {
    const value = e.target.value;
    const columnCountOutput = document.getElementById('column-count-output');

    columnCountOutput.textContent = value;
    document.getElementById("content").style.columnCount = value;
}

function populateImagesPage(collection, tabTitle) {
    const websiteTitle = determineSite(tabTitle);

    const imageCount = collection._images.length;
    const videoCount = collection._videos.length;
    document.getElementById('visual-website').innerText = websiteTitle;
    document.getElementById('visual-count').innerText = `${imageCount} images & ${videoCount} videos`;

    switch (determineSite(tabTitle)) {
        case "danbooru":
            danbooru(collection);
            break;
        case "yandere":
            yandere(collection);
            break;
        case "konachan":
            konachan(collection);
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

function danbooru(collection) {
    for (let i = 0; i < collection._images.length; i++) {
        const image = collection._images[i];
        if (image) {
            document.getElementById('content').append(
                createImageElement(
                    image._image,
                    image._imageLarge,
                    image._post,
                    image._id)
            );
        }
    }

    for (let i = 0; i < collection._videos.length; i++) {
        const video = collection._videos[i];
        if (video) {
            document.getElementById('content').append(
                createVideoElement(
                    video._video,
                    video._post,
                    video._id)
            );
        }
    }
}

function yandere(collection) {
    for (let i = 0; i < collection._images.length; i++) {
        const image = collection._images[i];
        if (image) {
            document.getElementById('content').append(
                createImageElement(image._image,
                    image._post,
                    image._id)
            );
        }
    }

    for (let i = 0; i < collection._videos.length; i++) {
        const video = collection._videos[i];
        if (video) {
            document.getElementById('content').append(
                createVideoElement(video._video,
                    video._post,
                    video._id)
            );
        }
    }
}

function konachan(collection) {
    let promises = [];
    collection._images.forEach(image => {
        promises.push(
            fetch(image._image)
                .then((response) => response.json()));
    });

    Promise.all(promises).then((values) => {
        for (let i = 0; i < values.length; i++) {
            document.getElementById('content').append(
                createImageElement(values[i].posts[0]['sample_url'], collection._images[i]._post, collection._images[i]._id)
            );
        }
    });
}

// TODO: add check if all got downloaded
function downloadAll(collection) {
    const PREFER_LARGE_IMAGES = true;
    const images = collection._images;
    // const videos = collection._videos;

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    today = `${dd}-${mm}-${yyyy}`;

    images.forEach(image => {
        const url = PREFER_LARGE_IMAGES ? image._imageLarge : image._image;
        const indexLastSlash = url.lastIndexOf('/');
        const file = url.substring(indexLastSlash + 1);
        const filename = PREFER_LARGE_IMAGES ? `${today}-HD/${file}` : `${today}/HD-${file}`;

        chrome.downloads.download({
            url: url,
            filename: filename,
            conflictAction: 'uniquify'
        }, downloadId => {
            if (downloadId) {
                // success
                console.log(`Started downloading: ${downloadId}`);
            }
            else {
                // error
                console.log(`Download failed`);
            }
        });
    });
}

function createImageElement(link, linkLarge, post, id) {
    const img = document.createElement('img');
    img.setAttribute('src', link);

    const img2 = document.createElement('img');
    img2.setAttribute('src', linkLarge);

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

    return article;
}

function createVideoElement(link, post, id) {
    const video = document.createElement('video');
    video.controls = true;
    video.loop = true;
    video.muted = true;

    const video2 = document.createElement('video');
    video2.controls = true;
    video2.loop = true;
    video2.muted = true;

    const source = document.createElement('source');
    source.setAttribute('src', link);

    const source2 = document.createElement('source');
    source2.setAttribute('src', link);

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

    return article;
}

