const path = require("path");
const fs = require("fs");
const postcss = require("postcss");
const log = require("../../utils/log");
const { getSFCJson, compileTpl, prettify } = require("../../utils/utils");
const plugin = require("./plugin.js");

const isVue = (f) => /\.vue$/.test(f);
const isLess = (f) => /\.less$/.test(f);

const vueFlag = true;

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

async function create(options) {
  let config;
  try {
    config = require(path.resolve("./transform.config.js"));
  } catch (error) {
    if (error) {
      console.log(error)
      return;
    }
  }

  log.success("init create...");
  // 读取当前目录下的文件夹
  const src = path.resolve(process.cwd(), config.srcPath || "src");

  walkSync(src, function (filePath, stat) {
    if (isVue(filePath) && vueFlag) {
      // 读取文件
      const vueFileContent = fs.readFileSync(filePath, "utf8");
      const sfc = getSFCJson(vueFileContent);
      // 获取style, postcss 会对注解识别报错
      const cssContent = prettify(sfc.styles[0].content).replace(/\/\/.+/g, "");

      const propsArr = config.propsArr;
      let cssConfig = {};
      Object.keys(propsArr).forEach(key => {
        if(typeof key === "string" && key !== "arrMaps") {
          cssConfig[key] = propsArr[key]
        }
        if(key === 'arrMaps') {
          const keys = propsArr[key].keys;
          keys.forEach(arrKey => {
            cssConfig[arrKey] = propsArr[key].func;
          })
        }
      })

      postcss([plugin(cssConfig)])
        .process(cssContent, {
          from: undefined,
        })
        .then((result) => {
          const r = result.css;
          const res = `<template>${sfc.template.content}
</template>
<script>${sfc.script.content}
</script>
<style lang="less" scoped>${cssContent}
</style>

<style lang="less" scoped>${r}
</style>
    `;
          fs.writeFileSync(filePath, res);
        });
    }
  });
}

module.exports = async (options) => {
  create(options);
};
