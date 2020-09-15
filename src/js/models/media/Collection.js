import ImageCollection from "./ImageCollection.js";
import ImageHTTPCollection from "./ImageHTTPCollection.js";

export default class Collection {
    constructor() {
        if (new.target === Collection) {
            throw new TypeError("Cannot create an instance of Collection. Collection is an abstract class.");
        }

        this._collections = [];
    }

    addCollection(collection) {
        this._collections.push(collection);
    }

    get imageLink() {
        return this._imageLinks;
    }
}