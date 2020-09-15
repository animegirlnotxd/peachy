export default class User {
    constructor(name) {
        this._name = name;
    }
    static new(props) {
        return new this(props.name);
    }
    greet() {
        return `Hello, I'm ${this._name}!`;
    }
}