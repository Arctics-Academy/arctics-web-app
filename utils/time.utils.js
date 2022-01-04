function currentTimeString() {
    let now = new Date;

    // Date
    let str = String(now.getFullYear()) + "-";
    str += __twoDigit(String(now.getMonth() + 1)) + "-";
    str += __twoDigit(String(now.getDate())) + " ";
    
    // Time
    str += __twoDigit(String(now.getHours())) + ":";
    str += __twoDigit(String(now.getMinutes())) + ":";
    str += __twoDigit(String(now.getSeconds()));

    return str;
}


function __twoDigit(str) {
    if (str.length == 1) str = "0" + str;
    return str;
}


module.exports = { currentTimeString };