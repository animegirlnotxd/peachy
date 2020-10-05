import Image from "./Image.js"

export default class VisualCollection {
    constructor() {
        this._images = [];
        this._videos = [];
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