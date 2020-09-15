import Medium from "./MediumCollection.js";

export default class ImageHTTPCollection extends Medium {
    constructor(needsFetch) {
        super(needsFetch);
        this._apiLinks = [];
    } 

    addApiLink(link) {
        this._apiLinks.push(link);
    }

    get apiLink() {
        return this._apiLinks;
    }
}