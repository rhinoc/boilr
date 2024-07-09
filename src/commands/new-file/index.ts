import * as vscode from 'vscode';
import { COMMAND } from '$constants/command';
import { EXTENSION_NAMES } from '$constants/name';
import { isExtensionError, makeError } from '$utils/common/error';
import { getNodes } from '$utils/common/node';
import { logger } from '$utils/business/logger';
import { NewFileErrorCode } from './error-code';
import { pickBoilerplate } from './pick';
import { apply } from './apply';
import path from 'path';
import fs from 'fs';
import { getConfigurationByKey } from '$utils/business/configuration';

export function registerCommand() {
  const disposable = vscode.commands.registerCommand(COMMAND.NEW_FILE, async (e?: vscode.Uri) => {
    try {
      // 0. [user] get target entry path
      let targetDirPath = e?.fsPath;
      if (!targetDirPath) {
        const activeFilePath = vscode.window.activeTextEditor?.document.fileName;
        if (activeFilePath) {
          targetDirPath = path.dirname(activeFilePath);
        } else {
          const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
          if (workspaceFolder) {
            targetDirPath = workspaceFolder.uri.fsPath;
          }
        }
      } else if (fs.statSync(targetDirPath).isFile()) {
        targetDirPath = path.dirname(targetDirPath);
      }

      if (!targetDirPath) {
        throw makeError(NewFileErrorCode.NO_TARGET_DIR_FOUND, `no target directory found`);
      }

      // 1. [user] get user picked boilerplate
      const pickResult = await pickBoilerplate();
      if (!pickResult.ok) {
        throw pickResult;
      }
      const boilerplate = pickResult.value;

      // 2. find all targets
      const nodes = getNodes(boilerplate.dirPath).filter(
        (node) => node.type === 'folder' || node.name.endsWith(getConfigurationByKey('suffix')),
      );

      if (nodes.length === 0) {
        throw makeError(NewFileErrorCode.BOILERPLATE_IS_EMPTY, `boilerplate '${boilerplate.label}' is empty`);
      }

      // 3. apply
      await apply(
        {
          boilerplatePath: boilerplate.dirPath,
          targetDirPath: targetDirPath,
          bolierplateName: boilerplate.label,
          timestamp: Date.now(),
          map: {},
          name: '',
        },
        nodes,
      );

      vscode.window.showInformationMessage(
        `[${EXTENSION_NAMES.original}] ${boilerplate.label} applied to ${targetDirPath} successfully!`,
      );
    } catch (ex) {
      logger.error(ex);

      let toastMsg = `boilerplate applied failed`;
      if (isExtensionError(ex)) {
        toastMsg += `\n${ex.code}: ${ex.msg}`;
      }
      logger.toast('error', toastMsg);
    }
  });

  return disposable;
}
