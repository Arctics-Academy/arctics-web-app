const fs = require('fs');


let read_file_to_base64 = (path) => {
    return fs.readFileSync(path, {encoding: 'base64'});
}


module.exports = { read_file_to_base64 }