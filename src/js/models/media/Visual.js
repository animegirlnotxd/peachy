export default class Visual {
    constructor(id, post, needsFetch = false) {
        if (new.target === Visual) {
            throw new TypeError("Cannot create an instance of Visual. Visual is an abstract class.");
        }

        needsFetch ? this._needsFetch = true : this._needsFetch = false;

        this._id = id;
        this._post = post;
    }

    getId() {
        return this._id;
    }

    get post() {
        return this._post;
    }

    needsFetch() {
        return this._needsFetch;
    }
}