const fs = require('fs');


let read_file_to_base64 = (path) => {
    return fs.readFileSync(path, {encoding: 'base64'});
}

let read_file_to_string = (path) => {
    return fs.readFileSync(path);
}

module.exports = { read_file_to_base64, read_file_to_string }