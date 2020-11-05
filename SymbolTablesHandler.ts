export class SymbolTablesHandler {


    contextStack : {tag: string, table: Map<string, any>}[] = 
    [{
            tag: "global",
            table: new Map(),
    }]


    state = {variableDeclaration: null, functionDeclaration: null}


    constructor() {}


    processToken(token : {id : string, value : any}) {

    }
    

}