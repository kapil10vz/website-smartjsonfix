const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwindcss = require('@tailwindcss/postcss');

const watch = process.argv.includes('--watch');
const minify = process.argv.includes('--minify');

async function build() {
  try {
    const input = fs.readFileSync('./input.css', 'utf-8');

    const result = await postcss(tailwindcss).process(input, {
      from: './input.css',
      to: './styles.css',
    });

    let css = result.css;

    if (minify) {
      // Simple minification: remove comments, extra whitespace
      css = css.replace(/\/\*[\s\S]*?\*\//g, ''); // remove comments
      css = css.replace(/\s+/g, ' '); // collapse whitespace
      css = css.replace(/\s*([{}:;,>+~])\s*/g, '$1'); // remove spaces around special chars
      css = css.trim();
    }

    fs.writeFileSync('./styles.css', css);
    console.log(`✓ styles.css generated${minify ? ' (minified)' : ''}`);
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

if (watch) {
  fs.watch('./input.css', () => {
    build();
  });
  console.log('Watching input.css for changes...');
  build();
} else {
  build();
}
