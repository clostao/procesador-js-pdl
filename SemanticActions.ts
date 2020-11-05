export class SemanticActions {

    tokens : any[] = []

    errors : any[] = []

    actions = new Map([
        [-10,(_lexeme : string) => this.tokenGenerator("IGUAL")("_")],
        [1,(_lexeme : string) => this.tokenGenerator("PUNTOCOMA")("_")],
        [2,(_lexeme : string) => this.tokenGenerator("COMA")("_")],
        [3,(_lexeme : string) => this.tokenGenerator("AbrParent")("_")],
        [4,(_lexeme : string) => this.tokenGenerator("CerParent")("_")],
        [5,(_lexeme : string) => this.tokenGenerator("AbrLlaves")("_")],
        [6,(_lexeme : string) => this.tokenGenerator("CerLlaves")("_")],
        [7,(_lexeme : string) => this.tokenGenerator("SUMA")("_")],
        [8,(_lexeme : string) => this.tokenGenerator("NEGACION")("_")],
        [9,(_lexeme : string) => this.tokenGenerator("MENOR")("_")],
        [10,(lexeme : string) => this.tokenGenerator("CADENA")(lexeme)],
        [11,(lexeme : string) => this.processIdentificator(lexeme)(lexeme)],
        [12,(lexeme : string) => this.tokenGenerator("ENTERO")(lexeme)],
        [13,(lexeme : string) => this.tokenGenerator("DECIMAL")(lexeme)],
    ])

    constructor () { }

    solveAction(lexeme : string, action : number) : any
    {
        if (action == 30)
            return
        if(action > 20)
        {
            let length = lexeme.length;

            this.solveAction(lexeme.substring(0, -1), action - 10)
            return this.solveBasicAction(lexeme.charAt(length-1))
        }
        let finalAction = this.actions.get(action)
        return finalAction && finalAction(lexeme)
    }

    solveError(lexeme: string) {
        console.error(`Error: Cannot resolve ${lexeme} to a token.`);
    }

    private processIdentificator(lexeme : string)
    {
        let value = lexeme.trim()
        switch (true) {
            case value == "function":return (_lexeme : string) => this.tokenGenerator("FUNCTION")("_")
            case value == "alert":return (_lexeme : string) => this.tokenGenerator("ALERT")("_")
            case value == "if":return (_lexeme : string) => this.tokenGenerator("IF")("_")
            case value == "input":return (_lexeme : string) => this.tokenGenerator("INPUT")("_")
            case value == "let":return (_lexeme : string) => this.tokenGenerator("LET")("_")
            case value == "number":return (_lexeme : string) => this.tokenGenerator("NUMBER")("_")
            case value == "boolean":return (_lexeme : string) => this.tokenGenerator("BOOLEAN")("_")
            case value == "else":return (_lexeme : string) => this.tokenGenerator("ELSE")("_")
            case value == "return":return (_lexeme : string) => this.tokenGenerator("RETURN")("_")
            case value == "string":return (_lexeme : string) => this.tokenGenerator("STRING")("_")
            default: return (lexeme : string) => this.tokenGenerator("IDENTIFICADOR")(this.positionAtTable(lexeme))
        }
    }

    private tokenGenerator(id : string)
    {
        return (value : any) => this.addToken(id, value)
    }

    private addToken(id: string, value: any) {
        let token = {id: id, value : value};
        console.log(token);
        this.tokens.push(token)
    }

    private positionAtTable(lexeme : string) {
        return (2);
    }

    private solveBasicAction(char : string) {
        switch (char) {
            case "=": return this.solveAction(char, -10);
            case ";": return this.solveAction(char, 1);
            case ",": return this.solveAction(char, 2);
            case "(": return this.solveAction(char, 3);
            case ")": return this.solveAction(char, 4);
            case "{": return this.solveAction(char, 5);
            case "}": return this.solveAction(char, 6);
            case "+": return this.solveAction(char, 7);
            case "!": return this.solveAction(char, 8);
            case "<": return this.solveAction(char, 9);
        }
    }

    generateFiles()
    {   
        this.generateTokenFile();
    }

    private generateTokenFile()
    {
        let tokenFileData = this.tokens.reduce((buffer, token) => {
            return (`${buffer}<${token.id},${(token.value == "_") ? " ": token.value}>\n`)
        }, "");
        Deno.writeTextFile("./tokens", tokenFileData);
    }

}

