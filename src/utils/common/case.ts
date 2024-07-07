import { NameCase } from '$constants/case';

export function getNameCaseList(name: string): Record<NameCase, string> {
  return {
    [NameCase.ORIGINAL]: name,
    [NameCase.LOWER_CASE]: name.toLowerCase(),
    [NameCase.UPPER_CASE]: name.toUpperCase(),
    [NameCase.SNAKE_CASE]: name
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLowerCase()
      .replace(/\s+/g, '_'),
    [NameCase.KEBAB_CASE]: name
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase()
      .replace(/\s+/g, '-'),
    [NameCase.PASCAL_CASE]: name
      .replace(/(^\w|_\w|\-\w|\s\w)/g, (match) => match.replace(/[\s_\-]/, '').toUpperCase())
      .replace(/^\w/, (match) => match.toUpperCase()),
    [NameCase.CAMEL_CASE]: name
      .replace(/(_\w|\-\w|\s\w)/g, (match) => match.charAt(1).toUpperCase())
      .replace(/^\w/, (match) => match.toLowerCase()),
    [NameCase.DOT_CASE]: name
      .replace(/([a-z])([A-Z])/g, '$1.$2')
      .toLowerCase()
      .replace(/\s+/g, '.'),
    [NameCase.UPPER_SNAKE_CASE]: name
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toUpperCase()
      .replace(/\s+/g, '_'),
  };
}
