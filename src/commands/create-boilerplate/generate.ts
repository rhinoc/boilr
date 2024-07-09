import fs from 'fs';
import path from 'path';
import type { Node } from '$utils/common/node';
import { drain } from '$utils/common/template';
import { getConfigurationByKey } from '$utils/business/configuration';

export function generateBoilerplates(
  targetDirPath: string,
  nodes: Node[],
  val2varInPath: Record<string, string>,
  val2varInFile: Record<string, string>,
) {
  const suffix = getConfigurationByKey('suffix');
  for (const node of nodes) {
    let newPath = path.join(targetDirPath, drain(node.relativePath, val2varInPath));

    if (node.type === 'file') {
      // create file
      let text = fs.readFileSync(node.path, { encoding: 'utf-8' });
      text = drain(text, val2varInFile);

      newPath = `${newPath}${suffix}`;

      fs.writeFileSync(newPath, text, { encoding: 'utf-8' });
    } else if (node.type === 'folder') {
      // create folder
      fs.mkdirSync(newPath, { recursive: true });
    }
  }
}
