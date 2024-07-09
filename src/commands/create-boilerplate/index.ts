import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import { COMMAND } from '$constants/command';
import { isExtensionError, makeError } from '$utils/common/error';
import { getConfigurationByKey } from '$utils/business/configuration';
import { logger } from '$utils/business/logger';
import { getNodes } from '$utils/common/node';
import { getAbsolutePath } from '$utils/business/path';
import { promptInputBox } from '$utils/business/prompt-input-box';
import { getNameVal2VarMap, getVariableTag } from '$utils/business/name-variable';
import { generateBoilerplates } from './generate';
import { CreateBoilerplateErrorCode } from './error-code';

export function registerCommand() {
  const disposable = vscode.commands.registerCommand(COMMAND.CREATE_BOILERPLATE, async (e?: vscode.Uri) => {
    try {
      // 0. [user] get source file/folder
      let sourceDirPath = e?.fsPath;
      if (!sourceDirPath) {
        const activeFilePath = vscode.window.activeTextEditor?.document.fileName;
        if (activeFilePath) {
          sourceDirPath = activeFilePath;
        }
      }

      if (!sourceDirPath) {
        throw makeError(CreateBoilerplateErrorCode.NO_TARGET_DIR_FOUND, `no source file/folder found`);
      }

      // 1. [user] get boilerplate name
      const boilerplateName = await promptInputBox(`input value for boilerplate's name`);

      if (boilerplateName.length === 0) {
        throw makeError(CreateBoilerplateErrorCode.INPUT_BOILERPLATE_NAME_INVALID, `boilerplate name is empty`);
      }
      // 2. [user] get name
      const name = await promptInputBox(`input value for ${getVariableTag('name')} to generate name varients`);

      if (name.length === 0) {
        throw makeError(
          CreateBoilerplateErrorCode.INPUT_NAME_VAR_INVALID,
          `value for ${getVariableTag('name')} is empty`,
        );
      }

      // 3. get all variants for name
      const filePriorities = getConfigurationByKey('nameVariablePriorityInFile');
      const pathPriorities = getConfigurationByKey('nameVariablePriorityInPath');
      const val2varInFile = getNameVal2VarMap(name, filePriorities);
      const val2varInPath = getNameVal2VarMap(name, pathPriorities);
      logger.info('val2varInFile', val2varInFile);
      logger.info('val2varInPath', val2varInPath);

      // 4. get all sources
      const nodes = getNodes(sourceDirPath, true).filter(
        (node) => node.type === 'folder' || !node.name.endsWith(getConfigurationByKey('suffix')),
      );

      // 5. get target dir path to store boilerplate
      const paths = getConfigurationByKey('path');
      if (paths.length < 0) {
        throw makeError(CreateBoilerplateErrorCode.NO_PATH_CONFIGURATED, 'no path configurated');
      }
      const parentDir = getAbsolutePath(paths[0]);
      const targetDirPath = path.join(parentDir, boilerplateName);
      if (fs.existsSync(targetDirPath)) {
        throw makeError(
          CreateBoilerplateErrorCode.INPUT_BOILERPLATE_NAME_DUPLICATED,
          `${boilerplateName} is already exist in ${parentDir}`,
        );
      }
      fs.mkdirSync(targetDirPath, { recursive: true });

      // 6. generate boilerplate
      generateBoilerplates(targetDirPath, nodes, val2varInPath, val2varInFile);

      logger.toast('info', `${boilerplateName} is created successfully!`);
    } catch (ex) {
      logger.error(ex);

      let toastMsg = `boilerplate created failed`;
      if (isExtensionError(ex)) {
        toastMsg += `\n${ex.code}: ${ex.msg}`;
      }
      logger.toast('error', toastMsg);
    }
  });

  return disposable;
}
