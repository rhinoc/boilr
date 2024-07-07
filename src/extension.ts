import * as vscode from 'vscode';
import { registerCommand as registerNewFileCommand } from './commands/new-file';
import { registerCommand as registerCreateBoilerplateCommand } from './commands/create-boilerplate';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(registerNewFileCommand());
  context.subscriptions.push(registerCreateBoilerplateCommand());
}

export function deactivate() {}
