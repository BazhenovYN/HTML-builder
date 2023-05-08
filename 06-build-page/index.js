const fs = require('fs');
const path = require('path');
const { readdir, stat, copyFile } = require('fs/promises');

const FOLDER_ASSETS = 'assets';
const FOLDER_STYLES = 'styles';
const FOLDER_DIST = 'project-dist';

const dist = path.join(__dirname, FOLDER_DIST);

function createFolder(path) {
  fs.mkdir(path, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

async function createBundle() {
  const folder = path.join(__dirname, FOLDER_STYLES);
  const bundlePath = path.join(dist, 'style.css');
  const bundle = fs.createWriteStream(bundlePath);

  const files = await readdir(folder, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isFile()) {
      const ext = path.extname(file.name);
      if (ext === '.css') {
        const fileCssPath = path.join(folder, file.name);
        const fileCss = fs.createReadStream(fileCssPath, 'utf-8');
        fileCss.on('data', (data) => {
          bundle.write(data);
        });
      }
    }
  });
}

async function copyFolderRecursive(src, dest) {
  const stats = await stat(src);
  const isDirectory = stats.isDirectory();

  if (isDirectory) {
    createFolder(dest);
    const childItems = await readdir(src);
    for (const childItem of childItems) {
      copyFolderRecursive(
        path.join(src, childItem),
        path.join(dest, childItem)
      );
    }
  } else {
    copyFile(src, dest);
  }
}

async function copyAssets() {
  const assets = path.join(__dirname, FOLDER_ASSETS);
  const assetsDist = path.join(dist, FOLDER_ASSETS);
  await copyFolderRecursive(assets, assetsDist);
}

function createHtmlFile() {
  const inputHtml = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  const outputHtml = fs.createWriteStream(path.join(dist, 'index.html'));
  inputHtml.on('data', async (data) => {
    let html = data.toString(data);
    const componentsPath = path.join(__dirname, 'components');
    const files = await readdir(componentsPath, { withFileTypes: true });
    for (const file of files) {
      const ext = path.extname(file.name);
      if (file.isFile() && ext === '.html') {
        const componentName = path.basename(file.name, ext);
        const componentPath = path.join(componentsPath, file.name);
        const component = fs.createReadStream(componentPath, 'utf-8');
        component.on('data', (data) => {
          html = html.replace(`{{${componentName}}}`, data);
          if (html.search(/{{[a-zA-Z]+}}/g) < 0) {
            outputHtml.write(html);
          }
        });
      }
    }
  });
}

createFolder(dist);
createBundle();
copyAssets();
createHtmlFile();
