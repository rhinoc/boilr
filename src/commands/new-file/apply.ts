import fs from 'fs';
import path from 'path';
import { BOILERPLATE_SUFFIX } from '$constants/file';
import type { Node } from '$utils/common/node';
import { fill } from '$utils/common/template';
import { logger } from '$utils/business/logger';
import type { Context } from './context';
import { getStaticVariableMap, getVariableListFromNodes, getVariableMapFromConfig } from './variable';
import { getBoilerplateConfig } from './config-parser';

export async function apply(ctx: Omit<Context, 'node'>, nodes: Node[]) {
  const { targetDirPath, boilerplatePath } = ctx;

  // get variable list from nodes
  const variables = getVariableListFromNodes(nodes);
  logger.info('variables parsed from boilerplate:', variables);

  // get variable value map
  const config = getBoilerplateConfig(boilerplatePath);
  const staticVarMap = await getStaticVariableMap(ctx, variables, config);
  logger.info('static variable map:', staticVarMap);

  // process every node
  for (const node of nodes) {
    let dynamicVarMap = {};
    if (config) {
      dynamicVarMap = getVariableMapFromConfig(
        {
          ...ctx,
          node,
          map: staticVarMap,
        },
        config,
      );
    }

    const var2val = {
      ...staticVarMap,
      ...dynamicVarMap,
    };

    let newPath = path.join(targetDirPath, fill(node.relativePath, var2val));
    if (node.type === 'file') {
      // create file
      let text = fs.readFileSync(node.path, { encoding: 'utf-8' });
      text = fill(text, var2val);

      newPath = newPath.slice(0, -BOILERPLATE_SUFFIX.length);
      fs.writeFileSync(newPath, text, { encoding: 'utf-8' });
    } else if (node.type === 'folder') {
      // create folder
      fs.mkdirSync(newPath, { recursive: true });
    }
  }
}
