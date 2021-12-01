const compiler = require('vue-template-compiler')
const stylusSupremacy = require('stylus-supremacy')

const formattingOptions =
stylusSupremacy.createFormattingOptionsFromStylint({})

const getSFCJson = function (content) {
  let res = compiler.parseComponent(content)
  return res
}

const compileTpl = function (tpl) {
  let res = compiler.compile(tpl, {
    comments: true,
    preserveWhitespace: false,
    shouldDecodeNewlines: true
  })
  return res
}

/**
 * 格式化代码
 * @param {*} code
 */
 const prettify = function (code) {
  if (code) {
    return stylusSupremacy.format(
      code,
      formattingOptions
    )
  }
  return '';
}

module.exports = { getSFCJson, compileTpl, prettify }