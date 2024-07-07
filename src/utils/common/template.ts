import Mustache from 'mustache';

function isMustacheTag<Rest extends any[] = any[]>(parsedItem: [string, string, ...Rest]) {
  const [type] = parsedItem;
  return ['name', '#', '&'].includes(type);
}

function getMustacheTag<Rest extends any[] = any[]>(parsedItem: [string, string, ...Rest]): string {
  const [, value] = parsedItem;

  const dotIndex = value.indexOf('.');
  if (dotIndex === -1 || dotIndex === 0 || dotIndex === value.length - 1) {
    // if not dot or starts/ends with dot
    return value;
  }

  // else return first part of the dot-separated value
  return value.split('.')[0];
}

export function getVariables(boilerplate: string) {
  const parsed = Mustache.parse(boilerplate);
  // @ts-expect-error
  const tags = parsed.filter(isMustacheTag).map(getMustacheTag) as string[];

  return Array.from(new Set(tags));
}

export function fill(boilerplate: string, var2val: Record<string, string>) {
  return Mustache.render(boilerplate, var2val);
}

export function drain(text: string, val2var: Record<string, string>) {
  return Object.entries(val2var).reduce((acc, [value, variable]) => {
    return acc.replaceAll(value, variable);
  }, text);
}
