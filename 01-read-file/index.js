const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const TEXT_FILE = 'text.txt';
const filePath = path.join(__dirname, TEXT_FILE);

const stream = fs.createReadStream(filePath, 'utf-8');

stream.on('data', data => stdout.write(data));
