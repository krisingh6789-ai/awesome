import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {launchBrowser} from './browser.mjs';
const root=path.resolve('docs');
const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(!url.pathname.startsWith('/awesome/')){res.writeHead(404).end();return}
  let rel=decodeURIComponent(url.pathname.slice('/awesome/'.length));
  if(!rel||rel.endsWith('/'))rel+='index.html';
  const file=path.resolve(root,rel);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
  try {
    const bytes=await readFile(file);
    const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webmanifest':'application/manifest+json','.woff2':'font/woff2','.png':'image/png','.svg':'image/svg+xml'};
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(bytes);
  }catch{res.writeHead(404).end()}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await launchBrowser();
try {
  const context=await browser.newContext();
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=`http://127.0.0.1:${server.address().port}/awesome/`;
  await page.goto(url);
  await page.getByRole('heading',{name:'A little better, every day.'}).waitFor();
  const scope=await page.evaluate(async()=>(await navigator.serviceWorker.ready).scope);
  assert.equal(scope,url);
  const manifest=await page.evaluate(async()=>await(await fetch('./manifest.webmanifest')).json());
  assert.equal(new URL(manifest.start_url,url).href,url);
  for(const icon of manifest.icons)assert.ok(new URL(icon.src,url).pathname.startsWith('/awesome/'));
  await page.reload();
  await page.getByRole('heading',{name:'A little better, every day.'}).waitFor();
  await context.setOffline(true);await page.reload();
  await page.getByRole('heading',{name:'A little better, every day.'}).waitFor();
  await page.getByRole('button',{name:'Continue learning',exact:true}).click();
  await page.getByRole('heading',{name:'Fundamental Rights',exact:true,level:1}).waitFor();
  assert.deepEqual(errors,[]);
  console.log('PASS: GitHub Pages /awesome/ subpath, manifest icons/start URL, service-worker scope and offline lesson reload.');
}finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve))}
