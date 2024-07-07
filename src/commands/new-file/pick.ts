import * as vscode from 'vscode';
import fs from 'fs';
import path from 'path';
import { makeError, makeOkWith, type ExtensionStatus } from '$utils/common/error';
import { getConfigurationByKey } from '$utils/business/configuration';
import { logger } from '$utils/business/logger';
import { getAbsolutePath } from '$utils/business/path';
import { NewFileErrorCode } from './error-code';

export interface BoilerplateQuickPickItem extends vscode.QuickPickItem {
  dirPath: string;
}

function getBoilerplateQuickPickItems(): ExtensionStatus<BoilerplateQuickPickItem[]> {
  // 1. get boilr paths, where user store boilerplates
  const paths = getConfigurationByKey('path');
  const absolutePaths = paths.map((item) => getAbsolutePath(item));
  logger.info('get boilr paths:', absolutePaths);

  if (absolutePaths.length < 0) {
    return makeError(NewFileErrorCode.NO_PATH_CONFIGURATED, 'no path configurated');
  }

  // 2. access all configured paths, get all boilerplates inside
  const quickPickItems: BoilerplateQuickPickItem[] = [];
  for (const absolutePath of absolutePaths) {
    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isDirectory()) {
      // skip invalid path
      continue;
    }

    // get all directories inside the path, each directory correspond to a boilerplate
    const dirPaths = fs
      .readdirSync(absolutePath)
      .map((item) => path.join(absolutePath, item))
      .filter((subPath) => fs.statSync(subPath).isDirectory());

    // add boilerplate to quick pick list
    for (const dirPath of dirPaths) {
      const folderName = path.basename(dirPath);
      quickPickItems.push({
        dirPath,
        label: folderName,
        description: dirPath,
      });
    }
  }

  if (quickPickItems.length === 0) {
    return makeError(NewFileErrorCode.NO_BOILERPLATE_FOUND, 'no avaliable boilerplate found');
  }

  return makeOkWith(quickPickItems);
}

export async function pickBoilerplate(): Promise<ExtensionStatus<BoilerplateQuickPickItem>> {
  const boilerplatesStatus = getBoilerplateQuickPickItems();

  if (!boilerplatesStatus.ok) {
    return boilerplatesStatus;
  }

  const { value: quickPickItems } = boilerplatesStatus;

  const quickPickHandler = vscode.window.createQuickPick<BoilerplateQuickPickItem>();
  quickPickHandler.items = quickPickItems;
  quickPickHandler.placeholder = 'Choose a boilerplate...';
  quickPickHandler.ignoreFocusOut = false;
  quickPickHandler.title = 'Pick a boilerplate';

  const promise = new Promise<ExtensionStatus<BoilerplateQuickPickItem>>((resolve) => {
    const disposable = quickPickHandler.onDidChangeSelection((e) => {
      // finally
      disposable.dispose();
      quickPickHandler.dispose();

      if (e.length !== 1) {
        resolve(
          makeError(NewFileErrorCode.PICK_BOILERPLATE_ERROR, 'no or more than one boilerplate has been selected', {
            count: e.length,
          }),
        );
        return;
      }
      const boilerplate = e[0];
      resolve(makeOkWith(boilerplate));
    });
  });

  quickPickHandler.show();

  return promise;
}
