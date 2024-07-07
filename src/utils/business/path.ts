import * as vscode from 'vscode';
import path from 'path';
import * as os from 'os';

export function getAbsolutePath(anyPath: string) {
  const normalizedPath = path.normalize(anyPath);
  let result = normalizedPath;
  if (normalizedPath.startsWith('~/')) {
    result = path.join(os.homedir(), normalizedPath.substring(2));
  } else {
    const workspaces = vscode.workspace.workspaceFolders ?? [];
    const mainWorkspacePath = workspaces[0]?.uri.fsPath ?? '';
    result = path.resolve(mainWorkspacePath, anyPath);
  }

  return result;
}
