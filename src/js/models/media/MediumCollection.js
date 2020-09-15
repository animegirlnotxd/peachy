export default class MediumCollection {
    constructor(needsFetch = false) {
        if (new.target === MediumCollection) {
            throw new TypeError("Cannot create an instance of MediumCollection. MediumCollection is an abstract class.");
        }

        needsFetch ? this._needsFetch = true : this._needsFetch = false;

        this._ids = [];
        this._posts = [];
    }

    addId(id) {
        this._ids.push(id);
    }

    addPost(post) {
        this._posts.push(post);
    }

    getIds() {
        return this._ids;
    }

    get posts() {
        return this._posts;
    }
}