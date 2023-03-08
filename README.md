<div align="center">

# deno911/utilities

#### Various utility modules for the Deno ecosystem, stored under one roof

</div>

---

## [**callsites**](./modules/callsites#readme)

Access call site data from the V8 stack trace API

- Features the new [zero-cost AsyncStackTrace API][asyncstacktrace-api]
- Determine otherwise inaccessible downstream data, like `import.meta.url`
  - <small>(this is the strategy used by the
    [**deno_blog**](https://github.com/denoland/blog) project)</small>

<br>

```ts
import { callsites } from "https://deno.land/x/callsites/mod.ts";

const call = () => callsites()[0];
const site = call();

site.getFileName();
// => "file:///Users/foo/bar.ts"
site.isAsync();
// => false
```

---

## Contributing

> _This section assumes you have [**the GitHub CLI**][gh-cli]_

### 1. Fork and clone the repository locally

```sh
gh repo fork deno911/utilities --clone
```

### 2. Create a new branch for your changes

```sh
git checkout -b fix/typo-in-readme
```

### 3. Make small changes and concise commits

✅ Ensure you've performed `fmt`, `lint`, **and** `test` before committing.

```sh
if deno fmt && deno lint && deno test -A --no-check --unstable; then
  git add README.md
  git commit -S[GPG-KEY-iD] -m "fix: typo in readme"
  git push
fi
```

### 4. Open a Pull Request

```sh
gh pr create --title "fix: typos in README.md"

# or just open github.com and use the web UI
```

> **Warning** · make sure you've selected the _**upstream**_ repo for your Pull
> Request!

<br><div align="center">

### [🅓🅔🅝🅞⑨①①][deno911]

</div>

[arweave]: https://arweave.org "Arweave Blockchain"
[codespaces]: https://github.com/features/codespaces "GitHub Codespaces Documentation"
[deno911]: https://github.com/deno911 "Projects by Deno911 on GitHub"
[deno-land]: https://deno.land "Deno.land - Official Module Registry"
[nest-land]: https://nest.land "Nest.land - Immutable Module Registry"
[dnt]: https://deno.land/x/dnt "dnt - Deno to Node Transformer"
[eggs-update]: https://docs.nest.land/eggs/updating-all-of-your-dependencies "Nest.land Documentation - Updating Dependencies with the Eggs CLI"
[eggs-cli]: https://docs.nest.land/eggs "Nest.land Documentation - the Eggs CLI"
[gh-cli]: https://cli.github.com "GitHub CLI Homepage"
[gh-actions]: https://actions.github.com "GitHub Actions Documentation"
[gitpod]: https://gitpod.io "Gitpod.io Homepage"
[npm]: https://npmjs.org "NPM Registry"
[open-in-gitpod]: https://gitpod.io/#https://github.com/deno911/utilities "Open in a new Gitpod Workspace"
[asyncstacktrace-api]: https://v8.dev/docs/stack-trace-api#async-stack-traces "V8 - Zero-Cost Async Stack Traces API"
