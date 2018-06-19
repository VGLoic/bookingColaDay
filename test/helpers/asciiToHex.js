module.exports = function asciiToHex(str) {
    var hex = "";
    for(var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        var n = code.toString(16);
        hex += n.length < 2 ? '0' + n : n;
    }
    while (hex.length < 64) {
      hex += '0'
    }
    return "0x" + hex;
};
