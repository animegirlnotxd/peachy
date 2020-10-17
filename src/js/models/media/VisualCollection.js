import Image from "./Image.js"

export default class VisualCollection {
    constructor(images = [], videos = []) {
        this._images = images;
        this._videos = videos;
    }

    addVisual(visual) {
        if (visual instanceof Image) {
            this._images.push(visual);
        }
        else {
            this._videos.push(visual);
        }
    }

    getImages() {
        return this._images;
    }

    getVideos() {
        return this._videos;
    }
}