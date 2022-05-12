const fs = require('fs');
const request = require('request');
const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

const args = process.argv.slice(2);
const paths = args[1].split('/');

const getFileFromServer = (args) => {
  // check if path is valid
  if (paths.length > 2) {
    fs.access(`./${paths[1]}`, function (error) {
      if (error) {
        console.log('invalid path:', error);
        process.exit();
      }
      console.log('valid path');
    });
  }

  request.get(args[0], (err, res, body) => {
    if (err) {
      console.log(err);
      process.exit();
    }

    if (fs.existsSync(args[1])) {
      rl.question('file exists overwrite? ', (input) => {
        if (input.toLowerCase() === 'y') {
          writeFileToLocal(body);
          rl.close();
        } else if (input.toLowerCase() === 'n') {
          process.exit();
        }
      });
    } else {
      writeFileToLocal(body);
      rl.close();
    }
    return;
  });
};

getFileFromServer(args);

const writeFileToLocal = (body) => {
  fs.writeFile(args[1], body, (err) => {
    if (err) return console.log('invalid to write:', err);

    fs.stat(args[1], (err, stat) => {
      if (err) return console.log(err);

      console.log(`Downloaded and saved ${stat.size} bytes to ${args[1]}`);
    });
  });
};
