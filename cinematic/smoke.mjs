import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const read=(file)=>readFileSync(file,'utf8');
for(const name of ['index.html','form.html','traders.html','document.html']){
 assert.ok(existsSync(name),`${name} missing`);
 const text=read(name);
 assert.ok(text.includes('cinematic/ui.css'),`${name} missing cinematic skin`);
 assert.ok(text.includes('cinematic-root'),`${name} missing React mount point`);
 assert.ok(text.includes('cinematic/runtime.js'),`${name} missing module entry`);
}
for(const name of ['index-page.js','form-page.js','traders-page.js','document-page.js','data/companies.json']){
 assert.ok(existsSync(name),`Business file missing: ${name}`);
}
const document=read('document.html');
assert.match(document,/id="documentPage"/);
assert.match(document,/class="info-table"/);
assert.match(document,/id="qrArea"/);
assert.match(document,/2\.518mm/);
assert.match(document,/1\.150mm/);
const css=read('cinematic/ui.css');
assert.match(css,/@media print/);
assert.match(css,/#cinematic-root/);
assert.ok(!css.includes('background: url(http'), 'no remote background imagery');
console.log('Cinematic smoke checks passed: legacy workflow and A4 remain available.');
