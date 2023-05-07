const { stdin, stdout } = require('process');
const fs = require('fs');
const path = require('path');

const TEXT_FILE = 'text.txt';
const filePath = path.join(__dirname, TEXT_FILE);
const output = fs.createWriteStream(filePath);

function final() {
  stdout.write(`Создан файл ${TEXT_FILE}\n`);
  process.exit();
}

stdout.write('Введите содержимое файла:\n');
stdin.on('data', data => {
  const str = data.toString().replace(/\r|\n/g, '');
  if (str === 'exit') {
    final();
  }
  output.write(data);
});

process.on('SIGINT', final);
