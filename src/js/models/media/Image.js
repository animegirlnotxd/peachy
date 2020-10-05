import Visual from "./Visual.js";

export default class Image extends Visual {
    constructor(image, id, post, needsFetch) {
        super(id, post, needsFetch);
        this._image = image;
    }
}