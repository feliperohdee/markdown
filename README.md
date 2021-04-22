Markdown is a dead simple **1kb** [Markdown] parser.

It's designed to be as minimal as possible, for constrained use-cases where a full Markdown parser would be inappropriate.

## Features

- **Fast:** since it's basically one regex and a huge if statement
- **Tiny:** it's 1kb of gzipped ES3
- **Simple:** pass a Markdown string, get back an HTML string

## Usage

Markdown exports a single function, which parses a string of Markdown and returns a String of HTML. Couldn't be simpler.

```js
import Markdown from 'markdown';

let md = '__this__ is **easy** to *use*.';
let html = Markdown(md);
console.log(html);
// <s>this</s> is <strong>easy</strong> to <i>use</i>.
```

[Markdown]: http://daringfireball.net/projects/markdown/
