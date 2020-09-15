import Medium from "./MediumCollection.js";

export default class ImageCollection extends Medium {
    constructor(needsFetch) {
        super(needsFetch);
        this._imageLinks = [];
    }

    addimageLink(link) {
        this._imageLinks.push(link);
    }

    get imageLink() {
        return this._imageLinks;
    }
}