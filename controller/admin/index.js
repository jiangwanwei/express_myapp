var fs = require('fs')
var path = require('path')

var dir = path.join(__dirname)

var controller = {},
    eachHandle = file => {
        let name = file.split('.')[0];
        controller[name] = require(`./${name}`)
    };

fs.readdirSync(dir)
  .forEach(eachHandle)

module.exports = controller