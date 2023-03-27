# marty

`marty` is a static site generator written in TypeScript.

It's main features are:

- Markdown as the basis for writing content
- [art-template](https://aui.github.io/art-template/) as it's template engine
- Automatic detection of `layout` and `config` files, no setup required

## Usage

```txt
marty <path> [options]

Positionals:
  path  Path to project directory                                       [string]

Options:
      --help           Show help                                       [boolean]
      --version        Show version number                             [boolean]
  -o, --out            The output path of the compiled directory
                                                              [default: "./out"]
  -c, --component-dir  Where to look for art-template component/partial files.
                                                        [default: "+components"]
```

## Project files

Your project structure may look like this:

```txt
my-project/
  +config.yaml
  +functions.ts
  +layout.html
  +components/
    footer.html
    ...
  index.md
  assets/
    styles.css
    favicon.png
  posts/
    +config.yaml
    +layout.html
    first.md
    second.md
    ...
  ...
```

As a general rule of thumb, files and foldes that begin with a plus (`+`) or a dot (`.`) are "ignored", meaning that they are not processed or copied over into the output directory. This is why the built-in file names begin with plusses.

#### `config.yaml`

The `config.yaml` file defines the data that will be available in the templates. Config files can be stacked on different levels, causing the data to be overwritten i ncase of duplicate keys. The config file data can be overwritten in two ways:

1. The Markdown template itself has some meta data written to it
2. By another config file. The config file at the top of the file hierarchy has the least effect, while every other config file will overwrite it. (**Note:** only duplicate keys are overwritten, other keys are inherited!)

Config files are good for defining some generic data that may apply to the documents in the same directory, or in sub directories.

#### `+layout.html`

The `+layout.html` file defines the layout of the current and child templates. Just like regular Markdown templates, the layout file supports `art-template` syntax. Layout files can inherit from parent layout files.

**TODO:** Reset the layout structure (chain of inheritence) by some config variable.

#### (NOT IMPLEMENTED) `+functions.js`

The `+functions.js` file is used for user-defined functions that can be used in templates. The functions can do anything that the Node runtime supports. This file should be located in the root directory of the project.

See [the art-template docs](https://aui.github.io/art-template/docs/syntax.html#Filters) for use of template functions (referred to as "filters").

#### Custom components

It's possible to define a components directory (`+components` in the root directory by default) that can be referenced by templates. This makes it possible to define re-usable html files that can be provided with specified data.

See [the art-template docs](https://aui.github.io/art-template/docs/syntax.html#Sub-template) for more information.
