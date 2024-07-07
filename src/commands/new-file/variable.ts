import fs from 'fs';
import { BUILT_IN_NAME_VARIABLE } from '$constants/variable';
import { getConfigurationByKey } from '$utils/business/configuration';
import { logger } from '$utils/business/logger';
import { promptInputBox } from '$utils/business/prompt-input-box';
import { assert } from '$utils/common/assert';
import type { Node } from '$utils/common/node';
import { getVariables } from '$utils/common/template';
import { type BoilerplateConfig } from './config-parser';
import type { Context } from './context';
import { getNameVar2ValMap } from '$utils/business/name-variable';

/**
 * variable map from user input name
 */
async function getNameAndNameVariableMap() {
  const name = await promptInputBox(`input value for {{name}} and it's varients`);
  assert(name.length, 'name is required');
  const map = getNameVar2ValMap(name);

  return [name, map] as const;
}

/**
 * variable map from settings
 */
function getVariableMapFromSettings() {
  return getConfigurationByKey('customVariables') ?? {};
}

/**
 * variable list from boilerplate config
 */
function getVariableListFromConfig(config: BoilerplateConfig) {
  const configVars = config?.variables ?? [];

  return configVars;
}

/**
 * variable map from boilerplate config
 */
export function getVariableMapFromConfig(ctx: Context, config: BoilerplateConfig) {
  try {
    return config?.inject?.(ctx) ?? {};
  } catch (ex) {
    logger.error(ex);
    return {};
  }
}

/**
 * check if a variable is built-in name variable
 */
function isBuiltInNameVariable(variable: string) {
  return Object.values(BUILT_IN_NAME_VARIABLE).includes(variable as any);
}

/**
 * get full static variable map except from config inject, because inject hook result is dynamic
 */
export async function getStaticVariableMap(
  ctx: Omit<Context, 'node'>,
  variables: string[],
  config?: BoilerplateConfig,
) {
  const result: Record<string, any> = {};

  // from user input name
  if (variables.some((variable) => isBuiltInNameVariable(variable))) {
    const [name, nameVarMap] = await getNameAndNameVariableMap();
    ctx.name = name;
    Object.assign(result, nameVarMap);
    logger.info('nameVars loaded:', nameVarMap);
  }

  // from settings
  const settingsVarMap = getVariableMapFromSettings();
  Object.assign(result, settingsVarMap);
  logger.info('settingsVarMap loaded:', settingsVarMap);

  // from boilerplate config
  let configVars: string[] = [];
  if (config) {
    configVars = getVariableListFromConfig(config);
  }
  logger.info('configVars found:', configVars);

  // left unknown variables that need user input
  for (const key of variables) {
    if (key in result || configVars.includes(key)) {
      continue;
    }

    const value = await promptInputBox(`input value for {{${key}}}`);
    assert(value.length > 0, `value for {{${key}}} is required`);
    if (value) {
      result[key] = value;
    }
  }

  return result;
}

export function getVariableListFromNodes(nodes: Node[]) {
  const variablesSet = new Set<string>();
  for (const node of nodes) {
    getVariables(node.name).forEach((variable) => variablesSet.add(variable));

    if (node.type === 'file') {
      const boilerplate = fs.readFileSync(node.path, { encoding: 'utf-8' });
      getVariables(boilerplate).forEach((variable) => variablesSet.add(variable));
    }
  }
  const variables = Array.from(variablesSet);
  return variables;
}
