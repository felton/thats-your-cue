# create-thats-your-cue

Start a new project from [That's your cue](https://github.com/felton/thats-your-cue), a ready-to-shoot Vite starter with React Router, shadcn/ui and Tailwind CSS.

```bash
pnpm create thats-your-cue my-app
cd my-app
pnpm install
pnpm dev
```

pnpm is recommended. `npm create thats-your-cue@latest my-app`, `yarn create thats-your-cue my-app` and `bun create thats-your-cue my-app` work too; the next steps it prints use the same tool.

It downloads the `template/` folder of the latest release into `my-app`, then runs the template's `make-it-yours`, which asks for the site's name, description and public URL and sets the copy up as your project.

## Options

| Option                 | Default            | Effect                                       |
| ---------------------- | ------------------ | -------------------------------------------- |
| `--template <version>` | the latest release | Template release, such as `0.0.1`            |
| `--name <name>`        | the directory name | Site name                                    |
| `--description <text>` | empty              | One-line description                         |
| `--url <url>`          | empty              | Public address, including any subpath        |
| `-y`, `--yes`          |                    | Don't ask; use defaults for anything not given |

For coding agents and CI, pass the values and `--yes`:

```bash
pnpm create thats-your-cue my-app --name "Bakery Co" --description "Fresh bread daily" --yes
```

Template releases are tagged `template-v0.0.1` and so on; `--template` takes `0.0.1`, `v0.0.1` or the full tag.

Docs: [felton.github.io/thats-your-cue](https://felton.github.io/thats-your-cue/)

## License

[MIT](LICENSE)
