# Boilr

![icon](/assets/logo.png)

[Boilr](https://marketplace.visualstudio.com/items?itemName=rhinoc.boilr) is a VSCode extension that enables you to **create** and **apply** boilerplate templates to generate any files or folders within your project workspace.

## Features

### Create Boilerplate from Exsiting Files

![Create Boilerplate](/assets/create_boilerplate.gif)

1. Right-click any file or folder in the file explorer and select `Create Boilerplate from Selection`.
2. Enter the boilerplate name, which will be the folder name under the `.boilr` folder.
3. Input the value of the name variable, which will be used to replace the name's variants to create the boilerplate. For example, if `hello world` is entered, varients like `hello_world`/`helloWorld`/`HELLO_WORLD` will be replaced with name variable tags.
4. 🎉 The boilerplate should be created under the `.boilr` folder in your workspace root.

> Tip: You can also create boilerplate from the command palette by typing `Create Boilerplate from Selection`. In that case, the current active file will be the source file.

### New Files from Boilerplate

![New File](/assets/new_file.gif)

1. Right-click any where you want to create files in the file explorer and go for `New File from Boilerplate...`.
2. Pick a boilerplate.
3. Input the value of the name variable, it will be used to replace the name's variants to create the boilerplate. For example, if `hello world` is entered, name variable tags in the boilerplate will be replaced with varients like `hello_world`/`helloWorld`/`HELLO_WORLD`.
4. 🎉 The files should be created in the selected folder.

> Tip: You can also create files from the command panel by typing `New File from Boilerplate...`. In that case, the directory of the current active file will be the target directory.

## Boilerplate Template Language

The underlying template engine utilized by Boilr is [Mustache](https://mustache.github.io/). For basic usage of this extension, you don't have to learn this language. But for advanced use, you may refer to [Mustache documentation](https://mustache.github.io/mustache.5.html).

> ⚡ Warning:  
> Mustache's default opening and closing tags is `{{` and `}}`.  
> However, to compatible with React TSX, Boilr's default tags is `%_` and `_%`.  
> You can customize default tags by setting `boilr.tags`.

### Glossary

- Tag: Tags are denoted by double mustaches, e.g., `%_person_%` is a tag with `person` as its key.
- Variable: The most fundamental tag type is the variable. For instance, if the tag is `%_person_%`, then `person` is the variable.

### Support Variables

#### Name Variables

| Variable Type    | Default Variable | Corresponding Tag | Example       |
| ---------------- | ---------------- | ----------------- | ------------- |
| Original         | original         | `%_ORIGINAL_%`    | some variable |
| Lower Case       | lowerCase        | `%_LOWER_CASE_%`  | some variable |
| Upper Case       | upperCase        | `%_UPPER_CASE_%`  | SOME VARIABLE |
| Camel Case       | camelCase        | `%_CAMEL_CASE_%`  | someVariable  |
| Snake Case       | snakeCase        | `%_SNAKE_CASE_%`  | some_variable |
| Upper Snake Case | upperSnakeCase   | `%_UPPER_CASE_%`  | SOME_VARIABLE |
| Kebab Case       | kebabCase        | `%_KEBAB_CASE_%`  | some-variable |
| Pascal Case      | pascalCase       | `%_PASCAL_CASE_%` | SomeVariable  |
| Dot Case         | dotCase          | `%_DOT_CASE_%`    | some.variable |

You can also customize those variables by setting `boilr.nameVariables` in settings.

#### Custom Variables

Boilr offers flexibility with custom variables, allowing you to tailor the boilerplate process to your specific needs. You can define custom variables in 2 primary ways:

1. Setting `boilr.customVariables` in VSCode Settings.

```jsonc
"boilr.customVariables": {
  "x": 1,
  "y": 2,
  "hello": {
    "world": 3,
  }
}

// then you can use %_x_% %_y_% %_hello.world_% in your boilerplate.
```

2. Using Configuration File `boilr.config.cjs`.

Boilr support config file named `boilr.config.cjs` under each boilerplate folder. The config file should export an object with `variables` and `inject` properties.

- `variables`: An array of strings listing your custom variables.
- `inject`: A function that receives a context object and returns an object. The returned object will be merged with the default variable map when applying the boilerplate.

```js
// boilr.config.cjs
module.exports = {
  variables: ['timestamp', 'nodeName', 'rand'],

  inject(ctx) {
    return {
      date: new Date(ctx.timestamp).toDateString(),
      rand: Math.random(),
    };
  },
};

// then you can use %_date_% and %_rand_% in your boilerplate.
```

The inject function receives a context object, which has following interface:

```ts
interface Context {
  // %_name_% from user input
  name: string;
  // Date.now()
  timestamp: number;
  // selected boilerplate's name
  bolierplateName: string;
  // selected boilerplate's path
  boilerplatePath: string;
  // target directory path
  targetDirPath: string;
  // current applying node
  node: {
    type: 'file' | 'folder';
    path: string;
    relativePath: string;
    name: string;
  };
  // variable map before injected
  map: Record<string, any>;
}
```

## Extension Settings

This extension contributes the following settings:

- `boilr.path`: The path to the boilerplates directory, relative to the workspace root path.
- `boilr.tags`: Customize opening and closing tags for Mustache to parsing templates. Default is `["%_","_%"].
- `boilr.suffix`: The suffix of the boilerplate file. Default is `.mustache`.
- `boilr.logLevel`: The log level of the extension. The default is `warn`, you can access logs in the output panel's `Boilr` channel.
- `boilr.nameVariables`: Customize your own name variables.
- `boilr.nameVariablePriorityInFile`: The priority of the name variable when same string encountered in creating boilerplate file.
- `boilr.nameVariablePriorityInPath`: The priority of the name variable when same string encountered in boilerplate file path.
- `boilr.customVariables`: Customize your own custom variables.
- `boilr.promptForMissingVariables`: Define if prompt a input box when encourter undefined variable in template.
