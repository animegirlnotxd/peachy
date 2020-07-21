chrome.runtime.onMessage.addListener(
	function(request) {
		populateImagesPage(request.urls);
		applyTitle(request.tabTitle);
});

window.addEventListener('load', () => {
	/*
	if(urls == undefined) {
		$("#info").html("Either this page wasn't opened through the normal use of the extension;<br>or a window reload occured and it cleared the fetched images.");
		$("#info").css({
			"border-left": "2px solid #FFB818"
		});
	}*/
});


const columnCount = document.getElementById('column-count');
const columnCountOutput = document.getElementById('column-count-output');

columnCount.addEventListener('input', updateValue);

function updateValue(e) {
	const value = e.target.value;

	columnCountOutput.textContent = value;
	document.getElementById("content").style.columnCount = value;
}


function populateImagesPage(urls) {
	$("#image-count").text(urls.length + " images ");

	urls.forEach(url => {
		let content;
		let urlExtension = url.split('.').pop();

		if((urlExtension == "mp4")
		||(urlExtension == "webm")) {
			let video = document.createElement('video');
			video.controls = true;
			video.loop = true;
			video.muted = true;

			let source = document.createElement('source');
			source.setAttribute('src', url);

			video.appendChild(source);

			content = video;
		}
		else {
			let img = document.createElement('img');
			img.setAttribute('src', url);
			content = img;
		}

		$("#content").append(content);
	});
}

function applyTitle(tabTitle) {

	// title cleanup
	if(tabTitle.includes("yande")) {
		document.title = "Results from yandere";
	}
	else if(tabTitle.includes("danbooru")) {
		document.title = "Results from danbooru";
	}
}