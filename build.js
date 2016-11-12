
// this is a really simple build script, if this takes off much better will be needed.

let findit = require('findit')
  , { join, dirname } = require('path')
  , series = require('async/series')
  , each = require('async/each')
  , marked = require('marked')
  , chalk = require('chalk')
  , mkdirp = require('mkdirp')
  , { execFile } = require('child_process')
  , { readFile, readFileSync, writeFile } = require('fs')
  , src = join(__dirname, 'src')
  , res = join(__dirname, 'resources')
  , out = join(__dirname, 'publish')
  , tmpl = readFileSync(join(__dirname, 'template.html'), 'utf8')
;

// XXX
//  card stuff

series(
  [
    // copy static files, then process MD
    (cb) => execFile('cp', ['-R', `${res}/`, out], cb),
    (cb) => processMD(cb),
  ],
  (err) => {
    if (err) return console.error(chalk.red(err));
    console.warn(chalk.bold.green('Ok!'));
  }
);

function processMD (cb) {
  let finder = findit(src)
    , list = []
  ;
  finder.on('path', (fileName) => {
    if (!/\.md$/.test(fileName)) return;
    let outName = fileName.replace(src, out).replace(/\.md$/, '.html');
    list.push({ fileName, outName });
  });
  finder.on('error', cb);
  finder.on('end', () => {
    each(
      list,
      (item, callback) => {
        readFile(item.fileName, 'utf8', (err, content) => {
          if (err) return cb(err);
          let parts = content.split(/--\n/)
            , locals = JSON.parse(parts.shift())
          ;
          if (locals.title) locals.title += ' • politi.es';
          else locals.title = 'politi.es';
          locals.content = marked(parts.join('--'));
          locals.hero = (item.fileName === join(src, 'index.md'))
            ? '<header class="do-we-need-another-hero"><h1>rethink</h1></header>'
            : ''
          ;
          locals.url_path = item.outName.replace(out, '');
          mkdirp(
            dirname(item.outName),
            (err) => {
              if (err) return callback(err);
              writeFile(
                item.outName,
                tmpl.replace(/\{\{(\w+)\}\}/g, (m, key) => (
                  (typeof locals[key] === 'undefined') ? '' : locals[key]
                )),
                'utf8',
                callback
              );
            }
          );
        });
      },
      (err) => {
        if (err) return console.error(chalk.red(err));
        console.warn(chalk.bold.green('Ok!'));
      }
    );
  });
}

// map(
//   [src, res, out],
//   treeView,
//   (err, [srcTree, resTree, outTree]) => {
//     if (err) throw err;
//     // delete the ones in the output that don't have an entry in input
//     let deletes = Object.keys(outTree).filter(path => (!srcTree[path] && !resTree[path]));
//     // XXX
//     //  - do the deletion
//     //  - make missing directories in output from both resources and
//   }
// );
//
//
// function treeView (root, cb) {
//   let finder = findit(root)
//     , tree = {}
//   ;
//   finder.on('path', (fileName, stat) => {
//     let mtime = stat.mtime.getTime()
//       , ctime = stat.ctime.getTime()
//     ;
//     tree[fileName] = {
//       isDir:    stat.isDirectory(),
//       modified: (ctime > mtime) ? ctime : mtime,
//     };
//   });
//   finder.on('error', (err) => cb);
//   finder.on('end', () => {
//     cb(null, tree);
//   });
// }
