// plugin.js
module.exports = (opts = {}) => {
  // Work with options here
  // https://postcss.org/api/#plugin

  return {
    postcssPlugin: "postcss-vue-stylus-transform",

    Once(root, postcss) {
      // Transform CSS AST here
      root.nodes.forEach((node) => {
        if (node.selector.indexOf("older") === -1) {
          node.selector = `[data-theme='older'] ${node.selector}`;
        }
        if (node.type === "rule") {
          node.nodes.forEach((n, i) => {
            if (n.type === "comment") {
              node.nodes.splice(i, 1);
            }
          });
        }
      });
      // decl 属性修改
      root.walkDecls(decl => {
        const declVal = decl.value;
        const declProp = decl.prop;
        const remCondition = /.+(rem|px)/.test(declVal);
        const propsArr = [
          "width",
          "height",
          "font-size",
          "line-height",
          "margin-top",
        ];
        const propCondition = propsArr.indexOf(declProp) > -1;
        if (remCondition && propCondition) {
          if (/.+(rem|px)/.test(declVal)) {
            const [_, val, unit] = declVal.match(/(.+)(rem|px)/);
            let result = (Number(val) * 1.5).toFixed(2) + unit;
            if (declProp === "font-size") {
              if (val <= 0.3) {
                const r2 = "0.36" + unit;
                result = r2;
              }
            }
            decl.value = result;
          }
        }
      })
    },
  };
};
module.exports.postcss = true;
