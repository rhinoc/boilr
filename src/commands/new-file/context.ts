export interface Context {
  // name variable that user input
  name: string;
  // Date.now()
  timestamp: number;
  // user choosed boilerplate's name
  bolierplateName: string;
  // user choosed boilerplate's path
  boilerplatePath: string;
  // target directory path
  targetDirPath: string;
  // current apply node
  node: {
    type: 'file' | 'folder';
    path: string;
    relativePath: string;
    name: string;
  };
  // variable map before injected
  map: Record<string, any>;
}
