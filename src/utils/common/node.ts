import fs from 'fs';
import path from 'path';

/** a node is rather a file or folder */
export interface Node {
  type: 'file' | 'folder';
  path: string;
  relativePath: string;
  name: string;
}

/** get all nodes inside certain directory, the input must be a directory */
function getDirNodes(entryDir: string, basePath?: string) {
  basePath = basePath || entryDir;

  const nodes: Node[] = [];
  const dirs = fs.readdirSync(entryDir, { withFileTypes: true });
  for (const dir of dirs) {
    const { name } = dir;
    const nodePath = `${entryDir}/${dir.name}`;
    if (dir.isDirectory()) {
      nodes.push({
        type: 'folder',
        path: nodePath,
        name,
        relativePath: nodePath.replace(basePath, ''),
      });
      nodes.push(...getDirNodes(nodePath, basePath));
    } else {
      nodes.push({
        type: 'file',
        path: nodePath,
        name,
        relativePath: nodePath.replace(basePath, ''),
      });
    }
  }

  return nodes;
}

/** get all nodes from a entry path, the path maybe a file or directory */
export function getNodes(entryPath: string, includeEntryDir?: boolean) {
  const entryName = path.basename(entryPath);

  if (fs.statSync(entryPath).isFile()) {
    // if is file, just return
    return [
      {
        type: 'file',
        path: entryPath,
        name: entryName,
        relativePath: entryName,
      } as Node,
    ];
  }

  // then must be folder
  const nodes: Node[] = getDirNodes(entryPath);

  if (includeEntryDir) {
    nodes.forEach((node) => {
      node.relativePath = path.join(entryName, node.relativePath);
    });

    nodes.unshift({
      type: 'folder',
      path: entryPath,
      name: entryName,
      relativePath: entryName,
    });
  }

  return nodes;
}
