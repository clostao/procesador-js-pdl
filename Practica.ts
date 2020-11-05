import { SemanticActions } from './SemanticActions.ts';
import { Rule } from "./Rule.ts";
import { FileHandler } from './FileHandler.ts';

async function initRules() {
  let grammarData = JSON.parse(await Deno.readTextFile("./grammar.json"));
  let grammar: Map<string, Rule> = new Map();
  Object.keys(grammarData).forEach((key) => grammar.set(key, new Rule()));
  Object.keys(grammarData).forEach((key) => {
    let rule = grammar.get(key) as Rule;
    let entry = grammarData[key];
    Object.keys(entry).forEach((terminal) => {
        rule && rule.addChecker(terminal, {noTerminal: grammar.get(entry[terminal].notTerminal), action: entry[terminal]['action'] || -1})
    });
  });
  let result = grammar.get("S");
  if (result) return result;
  throw new Error('There are some incorrect grammar rules.');
}


async function nextLexeme(sRule : Rule)
{
    let lexeme : string | undefined = ""
    let result : { rule: { noTerminal: Rule | undefined; action: number | undefined; } | undefined; lexeme: string; } = {rule: {noTerminal: sRule, action: -1}, lexeme: ""};

    try
    {
      while (result?.rule?.action == undefined || result?.rule?.action == -1)
      {
        result = result?.rule?.noTerminal?.solveRule(result.lexeme, fileHandler.getCurrentChar()) || (result);
        console.log(result.lexeme);
        fileHandler.goOneCharForward();
      }
    } catch (e)
    {
      fileHandler.getNextChar()
      let errorLexeme = readUntilDel(e.lexeme)
      semanticActionsHandler.solveError(errorLexeme?.trim());
      return (undefined);
    }
    return ({lexeme: result?.lexeme, action: result?.rule?.action});
}

function readUntilDel(lexeme : string) : string
{
    let char = lexeme.charAt(lexeme.length - 1);
    
    let result = lexeme;
    while (!(/[ \n\t;{}().,]/.test(char)) && !fileHandler.eofHasBeenRead())
    {
      char = fileHandler.getNextChar();
      console.log(char);
      result+=char;
    }
    return (result);
}

async function main()
{
  let sRule = await initRules();
  await fileHandler.readFile();
  
  let result : {lexeme: string | undefined, action: number | undefined } | undefined ;
  while (!fileHandler.eofHasBeenRead())
  {
    result = await nextLexeme(sRule);
    result && semanticActionsHandler.solveAction(result.lexeme?.trim() || "", result.action || 0)
  }
  semanticActionsHandler.generateFiles()
}


var fileHandler = new FileHandler(Deno.args[0]);
var semanticActionsHandler = new SemanticActions();

main()