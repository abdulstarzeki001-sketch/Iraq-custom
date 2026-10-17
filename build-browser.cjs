const fs=require('node:fs');
const path=require('node:path');
const ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
const root=__dirname;
const targets={'creative/src/Portal.tsx':'cinematic/Portal.js','creative/src/main.tsx':'cinematic/main.js','creative/src/scene.tsx':'cinematic/scene.js'};
for(const [input,output] of Object.entries(targets)){
 const code=fs.readFileSync(path.join(root,input),'utf8');
 const result=ts.transpileModule(code,{fileName:input,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX, target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,isolatedModules:true}});
 const errors=(result.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
 if(errors.length) throw new Error(errors.map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')).join('\n'));
 fs.writeFileSync(path.join(root,output),'// Compiled from '+input+' — see creative/src for TypeScript source.\n'+result.outputText);
 console.log(input,'=>',output,result.outputText.length,'bytes');
}
