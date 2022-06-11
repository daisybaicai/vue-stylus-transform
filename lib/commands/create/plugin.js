const isObject = (obj) => Object.prototype.toString.call(obj) === '[Object Object]';

// plugin.js
module.exports = (opts = {}) => {
  // Work with options here
  // https://postcss.org/api/#plugin

  return {
    postcssPlugin: "postcss-vue-stylus-transform",

    Once(root, postcss) {
      let keysArr = Object.keys(opts) || [];
      // Transform CSS AST here
      root.nodes.forEach((node) => {
        if (node.selector.indexOf("elder") === -1) {
          node.selector = `[data-theme='elder'] ${node.selector}`;
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
        if(keysArr.indexOf(declProp) > -1) {
          decl.value  = opts[declProp](declProp, declVal)
        }
      })
    },
  };
};
module.exports.postcss = true;
