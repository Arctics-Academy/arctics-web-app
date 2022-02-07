function currentTimeString() {
    let now = new Date;

    // Date
    let str = String(now.getFullYear()) + "-";
    str += _twoDigit(String(now.getMonth() + 1)) + "-";
    str += _twoDigit(String(now.getDate())) + " ";
    
    // Time
    str += _twoDigit(String(now.getHours())) + ":";
    str += _twoDigit(String(now.getMinutes())) + ":";
    str += _twoDigit(String(now.getSeconds()));

    return str;
}


function _twoDigit(str) {
    if (str.length == 1) str = "0" + str;
    return str;
}


module.exports = { currentTimeString };