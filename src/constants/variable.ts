import { getConfigurationByKey } from '$utils/business/configuration';
import type { NameCase } from './case';

export const BUILT_IN_NAME_VARIABLE: Record<NameCase, string> = {
  camelCase: `__CAMEL_CASE_NAME__`,
  pascalCase: `__PASCAL_CASE_NAME__`,
  kebabCase: `__KEBAB_CASE_NAME__`,
  snakeCase: `__SNAKE_CASE_NAME__`,
  dotCase: `__DOT_CASE_NAME__`,
  upperSnakeCase: `__UPPER_SNAKE_CASE_NAME__`,
  upperCase: `__UPPER_CASE_NAME__`,
  lowerCase: `__LOWER_CASE_NAME__`,
  original: `__ORIGINAL_NAME__`,
  ...getConfigurationByKey('nameVariables'),
};
