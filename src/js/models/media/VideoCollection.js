import Medium from "./MediumCollection.js";

export default class VideoCollection extends Medium {
    constructor(needsFetch) {
        super(needsFetch);
        this._videos = [];
    } 

    addVideoLink(link) {
        this._videos.push(link);
    }
}