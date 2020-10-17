import Visual from "./Visual.js";

export default class Image extends Visual {
    constructor(image, imageLarge, id, post, needsFetch) {
        super(id, post, needsFetch);
        this._image = image;
        this._imageLarge = imageLarge;
    }
}