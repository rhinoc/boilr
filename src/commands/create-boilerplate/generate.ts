import fs from 'fs';
import path from 'path';
import type { Node } from '$utils/common/node';
import { drain } from '$utils/common/template';
import { BOILERPLATE_SUFFIX } from '$constants/file';

export function generateBoilerplates(
  targetDirPath: string,
  nodes: Node[],
  val2varInFolder: Record<string, string>,
  val2varInFile: Record<string, string>,
) {
  for (const node of nodes) {
    let newPath = path.join(targetDirPath, drain(node.relativePath, val2varInFolder));

    if (node.type === 'file') {
      // create file
      let text = fs.readFileSync(node.path, { encoding: 'utf-8' });
      text = drain(text, val2varInFile);

      newPath = `${newPath}${BOILERPLATE_SUFFIX}`;

      fs.writeFileSync(newPath, text, { encoding: 'utf-8' });
    } else if (node.type === 'folder') {
      // create folder
      fs.mkdirSync(newPath, { recursive: true });
    }
  }
}
