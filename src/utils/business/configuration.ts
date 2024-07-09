import * as vscode from 'vscode';
import { EXTENSION_NAMES } from '$constants/name';
import type { NameCase } from '$constants/case';

/** coresponding to package.json configuration fields */
export interface Configuration {
  path: string[];
  logLevel: 'info' | 'warn' | 'error';
  nameVariables?: Record<NameCase, string>;
  nameVariablePriorityInFile?: NameCase[];
  nameVariablePriorityInPath?: NameCase[];
  customVariables?: Record<string, string>;
  promptForMissingVariables: boolean;
  tags: [string, string];
  suffix: string;
}

export function getConfigurationByKey<T extends keyof Configuration>(key: T): Configuration[T] {
  return vscode.workspace.getConfiguration(EXTENSION_NAMES.camelCase).get(key) as Configuration[T];
}
