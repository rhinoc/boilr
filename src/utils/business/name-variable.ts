import type { NameCase } from '$constants/case';
import { BUILT_IN_NAME_VARIABLE } from '$constants/variable';
import { getNameCaseList } from '$utils/common/case';
import { getConfigurationByKey } from './configuration';

/** less has higher priority */
function getPriority(num: number) {
  if (num < 0) {
    return 99999;
  }
  return num;
}

/** get name variables to values map */
export function getNameVar2ValMap(name: string) {
  const nameCases = getNameCaseList(name);
  const nameVariables: Record<string, string> = {};
  for (const [nameCase, value] of Object.entries(nameCases)) {
    const nameVariable = BUILT_IN_NAME_VARIABLE[nameCase as NameCase];
    nameVariables[nameVariable] = value;
  }
  return nameVariables;
}

/** get name values to variables map */
export function getNameVal2VarMap(name: string, priorities: NameCase[] = []) {
  const nameVariables = getNameVar2ValMap(name);
  const varPriorities = priorities.map((item) => BUILT_IN_NAME_VARIABLE[item]);
  const result: Record<string, string> = {};
  for (const [nameVariable, value] of Object.entries(nameVariables)) {
    // if not set before
    if (!result[value]) {
      result[value] = getVariableTag(nameVariable);
      continue;
    }

    // get prev name variable stripping tags
    const prevNameVariable = result[value].slice(2, -2);
    const prevPriority = getPriority(varPriorities.indexOf(prevNameVariable as NameCase));
    const currentPriority = getPriority(varPriorities.indexOf(nameVariable as NameCase));
    if (currentPriority < prevPriority) {
      // if has higher priority, override
      result[value] = getVariableTag(nameVariable);
    }
  }

  return result;
}

export function getVariableTag(variable: string, tags?: [string, string]) {
  const [openTag, closeTag] = tags ?? getConfigurationByKey('tags');
  return `${openTag}${variable}${closeTag}`;
}
