const fs = require("fs");
const path = require("path");
const log = require("../../utils/log");

function getConfig() {
  fs.readFile(path.resolve(__dirname,'./default-config.js'), "utf8",function(err,data){
    fs.writeFile(path.resolve("./transform.config.js"),data,function(err){
      if(err) {
        console.log(err)
      }
    })
  })
  log.success("已导出 transform.config.js");
}

module.exports = () => {
  getConfig();
};