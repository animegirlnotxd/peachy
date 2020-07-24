chrome.runtime.onMessage.addListener(function(request) {
		populateImagesPage(request.urls, request.tabTitle);
		applyTitle(request.tabTitle);
});

document.getElementById('column-count').addEventListener('input', updateValue);
window.addEventListener('load', () => {	
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

function populateImagesPage(urls, tabTitle) {
	document.getElementById('image-count').innerText = urls[0].length + " images ";

	if(isKonachan(tabTitle)) {
		let promises = [];
		// console.log(urls);
		urls[0].forEach(url => {
			promises.push(
				fetch(url)
				.then((response) => response.json()));
		});

		Promise.all(promises).then((values) => {
			for (let i = 0; i < values.length; i++) {
				document.getElementById('content').append(
					getImage(values[i].posts[0]['sample_url'], urls[1][i])
					);
			}
		});
	}
	else {
		for (let i = 0; i < values.length; i++) {
			document.getElementById('content').append(
				getImage(urls[0][i], urls[1][i])
				);
		}
	}
}

function applyTitle(tabTitle) {

	// title cleanup
	if(tabTitle.includes("danbooru")) {
		document.title = "Results from danbooru";
	}
	else if(tabTitle.includes("yande")) {
		document.title = "Results from yandere";
	}
	else if(tabTitle.includes("konachan")) {
		document.title = "Results from konachan";
	}
}

function isKonachan(tabTitle) {
	if(tabTitle.includes("konachan")) {
		return true;
	}
	
	return false;
}

function getImage(url, post) {
	let content;
	let urlExtension = url.split('.').pop();

	if((urlExtension == "mp4")
	|| (urlExtension == "webm")) {
		let video = document.createElement('video');
		video.controls = true;
		video.loop = true;
		video.muted = true;

		let source = document.createElement('source');
		source.setAttribute('src', url);

		video.appendChild(source);

		let a = document.createElement('a');
		a.setAttribute('href', post);
		a.appendChild(video); 

		content = a;
	}
	else {
		let img = document.createElement('img');
		img.setAttribute('src', url);

		let a = document.createElement('a');
		a.setAttribute('href', post);
		a.appendChild(img);
		
		content = a;
	}

	return content;
}