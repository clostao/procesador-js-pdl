import { LexicalError } from './ErrorHandler.ts';

export class Rule {
    checkers : ((arg0: string) => boolean)[] = [];
    map = new Map<(arg0: string) => boolean, {noTerminal: Rule | undefined, action : number | undefined}>();
    
    constructor() {}


    private getChecker(terminal : string)
    {
        switch (true)
        {
            case terminal.startsWith("reg"): return (c : string) => {return new RegExp(terminal.substr(3)).test(c)};
            case terminal == 'del': return (c : string) => {return /[\0\n\t ]/.test(c)};
            case terminal == "l":return (c : string) => /[A-Za-z]/.test(c);
            case terminal == 'd': return (c : string) => /[0-9]/.test(c)
            case terminal == 'eol': return (c : string) => c == "\n";
            case /'.'/.test(terminal): return (c : string) => c == terminal.charAt(1);
            default: throw new Error(`No se ha conseguido asignar ninguna operación de comprobación. at getChecker(string)`)
        }
    }

    addChecker(terminal : string, noTerminal : {noTerminal: Rule | undefined, action : number | undefined})
    {
        let checker = this.getChecker(terminal);
        checker && this.checkers.push(checker);
        checker && this.map.set(checker, noTerminal);
    }

    solveRule(lexeme : string, nextChar : string)
    {
        let checker = this.checkers.find((ckr: (arg0: string) => any) => ckr(nextChar))
        if (checker) return {rule: this.map.get(checker), lexeme: (lexeme+nextChar)}
        throw new LexicalError(lexeme+nextChar);
    }

}