const path = require('path');
const { readdir, stat } = require('fs/promises');

const FOLDER_NAME = 'secret-folder';
const folder = path.join(__dirname, FOLDER_NAME);

async function findFiles() {
  const files = await readdir(folder, { withFileTypes: true });
  files.forEach(async (file) => {
    if (file.isFile()) {
      const stats = await stat(path.join(folder, file.name));
      const ext = path.extname(file.name);
      const name = path.basename(file.name, ext);
      const size = Number(stats.size / 1024).toFixed(2);
      console.log(`${name} - ${ext.slice(1)} - ${size}KB`);
    }
  });
}

findFiles();
