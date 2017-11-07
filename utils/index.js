var fs = require('fs')

function mapAllFile(dir) {
    var files = {},
        eachHandle = file => {
            let name = file.split('.')[0];
            files[name] = require(`./${name}`)
        };
    fs.readdirSync(dir)
      .forEach(eachHandle);
    return files;
}


module.exports = {
    mapAllFile: mapAllFile,
}

