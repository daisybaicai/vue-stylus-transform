const isUnitValue = (declVal) => {
  return /.+(rem|px)/.test(declVal);
};

const getUnitValue = (declVal) => {
  if (isUnitValue(declVal)) {
    const [_, val, unit] = declVal.match(/(.+)(rem|px)/);
    return [val, unit];
  }
};

module.exports = {
  srcPath: "src",
  propsArr: {
    arrMaps: {
      keys: ["width", "height", "line-height"],
      func: (prop, value) => {
        if (prop === "width") {
          if (value * 1.5 > 375) {
            return value;
          }
          return value * 1.5;
        } else {
          const [val, unit] = getUnitValue(value);
          let result = (Number(val) * 1.5).toFixed(2) + unit;
          return result;
        }
      },
    },
    "font-size": (prop, value) => {
      const [val, unit] = getUnitValue(value);
      let result = (Number(val) * 1.5).toFixed(2) + unit;
      if (val <= 18) {
        return "18" + unit;
      }
      return result;
    },
    "margin-bottom": (props, value) => {
      return "999px";
    },
  },
};
