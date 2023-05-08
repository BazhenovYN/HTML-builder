const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const FOLDER_STYLES = 'styles';
const FOLDER_DIST = 'project-dist';

async function createBundle() {
  const folder = path.join(__dirname, FOLDER_STYLES);
  const bundlePath = path.join(__dirname, FOLDER_DIST, 'bundle.css');
  const bundle = fs.createWriteStream(bundlePath);

  const files = await readdir(folder, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const fileCssPath = path.join(folder, file.name);
      const fileCss = fs.createReadStream(fileCssPath, 'utf-8');
      fileCss.on('data', (data) => {
        bundle.write(data);
      });   
    }
  });
}

createBundle();
