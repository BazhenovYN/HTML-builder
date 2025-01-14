const fs = require('fs');
const path = require('path');
const { readdir, copyFile } = require('fs/promises');

const FOLDER_NAME = 'files';
const NEW_FOLDER_NAME = 'files-copy';

function copyFolder() {
  const newFolder = path.join(__dirname, NEW_FOLDER_NAME);
  fs.rm(newFolder, { recursive: true, force: true }, (err) => { 
    if (err) { 
      throw err; 
    } else {
      fs.mkdir(newFolder, { recursive: true }, async (err) => {
        if (err) {
          throw err;
        } else {
          const folder = path.join(__dirname, FOLDER_NAME);
          const files = await readdir(folder);
          for (const file of files) {
            const filePath = path.join(folder, file);
            const newFilePath = path.join(newFolder, file);
            copyFile(filePath, newFilePath);
          }
        }
      });
    }
  });
}

copyFolder();
