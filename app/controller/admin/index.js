var fs = require('fs')
var path = require('path')

var dir = path.join(__dirname)

var controller = {},
    eachHandle = file => {
        let name = file.replace(/\.js$/, '');
        controller[name] = require(`./${name}`)
    };

fs.readdirSync(dir)
  .forEach(eachHandle)

module.exports = controller