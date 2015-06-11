var re_ansi = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/;
var openTags = {
    '0': 'font-weight:normal;opacity:1;color:#000;background:transparent',
    '1': 'font-weight:bold',
    '2': 'opacity:0.8',
    '3': '<i>',
    '4': '<u>',
    '7': 'background:#000;color:#fff',
    '8': 'display:none',
    '9': '<del>',
    '90': 'color: #888'
};

var styles = {
    '000': 30,
    'ff0000': 31,
    '209805': 32,
    'e8bf03': 33,
    '0000ff': 34,
    'ff00ff': 35,
    '00ffee': 36,
    'fff': 37
};
for (var key in styles) {
    var code = styles[key];
    openTags[code.toString()] = 'color:#' + key;
    openTags[(code + 10).toString()] = 'background:#' + key;
}
var closeTags = {
    '23': '</i>',
    '24': '</u>',
    '29': '</del>'
};
[
    0,
    21,
    22,
    27,
    28,
    39,
    49
].forEach(function (n) {
    closeTags[n] = '</span>';
});
module.exports = function (text) {
    if (!re_ansi.test(text)) {
        return text;
    }
    var ansiCodes = [];
    var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
        var ot = openTags[seq];
        if (ot) {
            if (!!~ansiCodes.indexOf(seq)) {
                ansiCodes.pop();
                return '</span>';
            }
            ansiCodes.push(seq);
            return ot[0] == '<' ? ot : '<span style="' + ot + ';">';
        }
        var ct = closeTags[seq];
        if (ct) {
            ansiCodes.pop();
            return ct;
        }
        return '';
    });
    var l = ansiCodes.length;
    l > 0 && (ret += Array(l + 1).join('</span>'));
    return ret;
};