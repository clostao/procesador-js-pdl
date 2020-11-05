export class LexicalError extends Error {
    constructor(public lexeme : string) {
        super();
    }
}