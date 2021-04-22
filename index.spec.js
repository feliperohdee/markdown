const {
	expect
} = require('chai');

const md = require('./');

describe('md()', () => {
	describe('text formatting', () => {
		it('parses bold with **', () => {
			expect(md('I **like** tiny libraries')).to.equal('I <strong>like</strong> tiny libraries');
		});

		it('parses italics with *', () => {
			expect(md('I *like* tiny libraries')).to.equal('I <em>like</em> tiny libraries');
		});

		it('parses underline with __', () => {
			expect(md('I __like__ tiny libraries')).to.equal('I <u>like</u> tiny libraries');
		});
		
		it('parses strike with ~~', () => {
			expect(md('I ~~like~~ tiny libraries')).to.equal('I <s>like</s> tiny libraries');
		});
	});

	describe('titles', () => {
		it('parses H1 titles', () => {
			expect(md('# I like tiny libraries')).to.equal('<h1>I like tiny libraries</h1>');
		});

		it('parses underlined H1 titles', () => {
			expect(md('I like tiny libraries\n===')).to.equal('<h1>I like tiny libraries</h1>');
		});

		it('parses H2 titles', () => {
			expect(md('## I like tiny libraries')).to.equal('<h2>I like tiny libraries</h2>');
		});

		it('parses H3 titles', () => {
			expect(md('### I like tiny libraries')).to.equal('<h3>I like tiny libraries</h3>');
		});

		it('parses titles with reference links', () => {
			expect(
				md('# I like [tiny libraries]\n\n[tiny libraries]: https://github.com/developit/md')
			).to.equal('<h1>I like <a href="https://github.com/developit/md">tiny libraries</a></h1>');
		});
	});

	describe('links & images', () => {
		it('parses links', () => {
			expect(md('[md](http://github.com/developit/md)')).to.equal('<a href="http://github.com/developit/md">md</a>');
		});

		it('parses anchor links', () => {
			expect(md('[Example](#example)')).to.equal('<a href="#example">Example</a>');
		});

		it('parses images', () => {
			expect(md('![title](foo.png)')).to.equal('<img src="foo.png" alt="title">');
			expect(md('![](foo.png)')).to.equal('<img src="foo.png" alt="">');
		});

		it('parses images within links', () => {
			expect(md('[![](toc.png)](#toc)')).to.equal('<a href="#toc"><img src="toc.png" alt=""></a>');
			expect(md('[![a](a.png)](#a) [![b](b.png)](#b)')).to.equal('<a href="#a"><img src="a.png" alt="a"></a> <a href="#b"><img src="b.png" alt="b"></a>');
		});

		it('parses reference links', () => {
			expect(md('\nhello [World]!\n[world]: http://world.com')).to.equal('hello <a href="http://world.com">World</a>!');
		});

		it('parses reference links without creating excessive linebreaks', () => {
			expect(md('\nhello [World]!\n\n[world]: http://world.com')).to.equal('hello <a href="http://world.com">World</a>!');
		});
	});

	describe('lists', () => {
		it('parses an unordered list with *', () => {
			expect(md('* One\n* Two')).to.equal('<ul><li>One</li><li>Two</li></ul>');
		});

		it('parses an unordered list with -', () => {
			expect(md('- One\n- Two')).to.equal('<ul><li>One</li><li>Two</li></ul>');
		});

		it('parses an unordered list with +', () => {
			expect(md('+ One\n+ Two')).to.equal('<ul><li>One</li><li>Two</li></ul>');
		});

		it('parses an unordered list with mixed bullet point styles', () => {
			expect(md('+ One\n* Two\n- Three')).to.equal('<ul><li>One</li><li>Two</li><li>Three</li></ul>');
		});

		it('parses an ordered list', () => {
			expect(md('1. Ordered\n2. Lists\n4. Numbers are ignored')).to.equal('<ol><li>Ordered</li><li>Lists</li><li>Numbers are ignored</li></ol>');
		});
	});

	describe('line breaks', () => {
		it('parses two new lines as line breaks', () => {
			expect(md('Something with\n\na line break')).to.equal('Something with<br />a line break');
		});
		
		it('parses three new lines as line breaks', () => {
			expect(md('Something with\n\n\na line break')).to.equal('Something with<br /><br />a line break');
		});
	});

	describe('code & quotes', () => {
		it('parses inline code', () => {
			expect(md('Here is some code `var a = 1`.')).to.equal('Here is some code <code>var a = 1</code>.');
		});

		it('escapes inline code', () => {
			expect(md('a `<">` b')).to.equal('a <code>&lt;&quot;&gt;</code> b');
		});

		it('parses three backtricks (```) as a code block', () => {
			expect(md('```\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).to.equal('<pre class="code "><code>function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre>');

			expect(md('```js\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).to.equal('<pre class="code js"><code class="language-js">function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre>');
		});

		it('parses tabs as a code poetry block', () => {
			expect(md('\tvar a = 1')).to.equal('<pre class="code poetry"><code>var a = 1</code></pre>');
		});

		it('escapes code/quote blocks', () => {
			expect(md('```\n<foo>\n```')).to.equal('<pre class="code "><code>&lt;foo&gt;</code></pre>');
			expect(md('\t<foo>')).to.equal('<pre class="code poetry"><code>&lt;foo&gt;</code></pre>');
		});

		it('parses a block quote', () => {
			expect(md('> To be or not to be')).to.equal('<blockquote>To be or not to be</blockquote>');
		});

		it('parses lists within block quotes', () => {
			expect(md('> - one\n> - two\n> - **three**\nhello')).to.equal('<blockquote><ul><li>one</li><li>two</li><li><strong>three</strong></li></ul></blockquote>\nhello');
		});
	});

	describe('horizontal rules', () => {
		it('should parse ---', () => {
			expect(md('foo\n\n---\nbar')).to.equal('foo<hr />bar');
			expect(md('foo\n\n----\nbar'), '----').to.equal('foo<hr />bar');
			expect(md('> foo\n\n---\nbar')).to.equal('<blockquote>foo</blockquote><hr />bar');
		});

		it('should parse * * *', () => {
			expect(md('foo\n* * *\nbar')).to.equal('foo<hr />bar');
			expect(md('foo\n* * * *\nbar'), '* * * *').to.equal('foo<hr />bar');
			expect(md('> foo\n\n* * *\nbar')).to.equal('<blockquote>foo</blockquote><hr />bar');
		});
	});

	describe('edge cases', () => {
		it('should close unclosed tags', () => {
			expect(md('*foo')).to.equal('<em>foo</em>');
			expect(md('foo**')).to.equal('foo<strong></strong>');
			expect(md('[some **bold text](#winning)')).to.equal('<a href="#winning">some <strong>bold text</strong></a>');
			expect(md('`foo')).to.equal('`foo');
		});

		it('should not choke on single characters', () => {
			expect(md('*')).to.equal('<em></em>');
			expect(md('**')).to.equal('<strong></strong>');
			expect(md('>')).to.equal('>');
			expect(md('`')).to.equal('`');
		});
	});
});
