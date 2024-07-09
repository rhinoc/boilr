import { getConfigurationByKey } from '$utils/business/configuration';
import type { NameCase } from './case';

export const BUILT_IN_NAME_VARIABLE: Record<NameCase, string> = {
  camelCase: `CAMEL_CASE`,
  pascalCase: `PASCAL_CASE`,
  kebabCase: `KEBAB_CASE`,
  snakeCase: `SNAKE_CASE`,
  dotCase: `DOT_CASE`,
  upperSnakeCase: `UPPER_SNAKE_CASE`,
  upperCase: `UPPER_CASE`,
  lowerCase: `LOWER_CASE`,
  original: `ORIGINAL`,
  ...getConfigurationByKey('nameVariables'),
};
