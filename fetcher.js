const fs = require('fs');
const request = require('request');
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

const args = process.argv.slice(2);
const paths = args[1].slice(0, 2);

let answer;

const getFileFromServer = (args) => {
  request.get(args[0], (err, res, body) => {
    if (err) {
      console.log(err);
      process.exit();
    }

    if (fs.existsSync(args[1])) {
      rl.question('file exists overwrite? ', (input) => {
        if (input.toLowerCase() === 'y') {
          answer = true;
          rl.close();
        } else if (input.toLowerCase() === 'n') {
          answer = false;
          rl.close();
          process.exit();
        }
      });
    }

    if (answer) {
      fs.writeFile(args[1], body, (err) => {
        if (err) return console.log(err);

        fs.access(paths, function (error) {
          if (error) {
            return console.log(error);
          }
          console.log('valid path');
        });

        fs.stat(args[1], (err, stat) => {
          if (err) return console.log(err);

          console.log(`Downloaded and saved ${stat.size} bytes to ${args[1]}`);
        });
      });
    }
  });
};

getFileFromServer(args);
