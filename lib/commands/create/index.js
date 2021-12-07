const path = require("path");
const fs = require("fs");
const postcss = require("postcss");
const log = require("../../utils/log");
const { getSFCJson, compileTpl, prettify } = require("../../utils/utils");
const plugin = require("./plugin.js");

const isVue = (f) => /\.vue$/.test(f);

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
  log.success("create2");
  // 读取当前目录下的文件夹
  const src = path.resolve(process.cwd(), "src/pages");

  walkSync(src, function (filePath, stat) {
    if (isVue(filePath)) {
      // console.log(filePath);
      // open file
      // 读取文件
      const vueFileContent = fs.readFileSync(filePath, "utf8");
      // console.log('file', vueFileContent)
      // 获取sfc结构
      const sfc = getSFCJson(vueFileContent);
      // 获取style, postcss 会对注解识别报错
      const cssContent = prettify(sfc.styles[0].content).replace(/\/\/.+/g, '');
      postcss([plugin])
        .process(cssContent, {
          from: undefined,
        })
        .then((result) => {
          const r = result.css;
          const res = `<template>${sfc.template.content}
</template>
<script>${sfc.script.content}
</script>
<style lang="stylus" scoped>${cssContent}
</style>

<style lang="stylus" scoped>${r}
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
