const path = require('path');
const { readdir, stat } = require('fs/promises');

const FOLDER_NAME = 'secret-folder';
const folder = path.join(__dirname, FOLDER_NAME);

async function findFiles() {
  const files = await readdir(folder, { withFileTypes: true });
  files.forEach(async (file) => {
    if (file.isFile()) {
      const stats = await stat(path.join(folder, file.name));
      const ext = path.extname(file.name).slice(1);
      const size = Number(stats.size / 1024).toFixed(2);
      console.log(`${file.name} - ${ext} - ${size}KB`);
    }
  });
}

findFiles();
