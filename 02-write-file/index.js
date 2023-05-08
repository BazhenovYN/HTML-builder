const { stdin: input, stdout: output } = require('process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const TEXT_FILE = 'text.txt';
const filePath = path.join(__dirname, TEXT_FILE);
const file = fs.createWriteStream(filePath);

function final() {
  output.write(`>>>Введенные данные записаны в файл ${TEXT_FILE}\n`);
  process.exit();
}

output.write('>>>Введите содержимое файла:\n');
const rl = readline.createInterface({ input, output });

rl.on('line', (str) => {
  if (str === 'exit') {
    final();
  }
  file.write(`${str}\n`);
});

rl.on('SIGINT', final);
