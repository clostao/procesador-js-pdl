export class FileHandler {

    fileData : string = ""
    position = 0;


    constructor(private filename : string) {}

    readFile() {
        return (Deno.readTextFile(this.filename).then((filedata: string) => this.fileData = filedata.concat("\n")));
    }

    getNextChar()
    {
        if (this.position == this.fileData.length)
            return ("\0");
        return (this.fileData[this.position++] || "");
    }

    getCurrentChar = () => this.fileData.charAt(this.position);

    goOneCharForward = () => {this.position++}

    eofHasBeenRead = () => this.position >= this.fileData.length

}