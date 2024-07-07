import * as vscode from 'vscode';

export async function promptInputBox(msg: string): Promise<string> {
  const userInput = await vscode.window.showInputBox({
    placeHolder: msg,
  });

  return userInput ?? '';
}
