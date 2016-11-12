
// this is a really simple build script, if this takes off much better will be needed.

let findit = require('findit')
  , { join } = require('path')
  , map = require('async/map')
  , src = join(__dirname, 'src')
  , res = join(__dirname, 'resources')
  , out = join(__dirname, 'publish')
;

map(
  [src, res, out],
  treeView,
  (err, [srcTree, resTree, outTree]) => {
    if (err) throw err;
    let deletes = Object.keys(outTree).filter(path => (!srcTree[path] && !resTree[path]));

  }
);


function treeView (root, cb) {
  let finder = findit(root)
    , tree = {}
  ;
  finder.on('path', (fileName, stat) => {
    let mtime = stat.mtime.getTime()
      , ctime = stat.ctime.getTime()
    ;
    tree[fileName] = {
      isDir:    stat.isDirectory(),
      modified: (ctime > mtime) ? ctime : mtime,
    };
  });
  finder.on('error', (err) => cb);
  finder.on('end', () => {
    cb(null, tree);
  });
}
