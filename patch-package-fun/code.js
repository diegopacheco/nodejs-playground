module.exports = {
    function(str, width, char) {
      char = char || "0";
      str = str.toString();
      while (str.length < width)
        str = char + str;
      return str;
    }, rightPad: function (str, width, char) {
      char = char || "0";
      str = str.toString();
      while (str.length < width)
        str = str + char;
      return str;
    }
  };
  