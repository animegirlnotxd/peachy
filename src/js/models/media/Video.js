import Visual from "./Visual.js";

export default class Video extends Visual {
    constructor(video, id, post, needsFetch) {
        super(id, post, needsFetch);
        this._video = video;
    }
}