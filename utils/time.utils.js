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

function timestampToString(timestamp) {
    let str
    str += String((timestamp.getFullYear())) + "年"
    str += _twoDigit(String((timestamp.getMonth()))) + "月"
    str += _twoDigit(String((timestamp.getDate()))) + "日"
    str += _twoDigit(String((timestamp.getHours()))) + "時"
    str += _twoDigit(String((timestamp.getMinutes()))) + "分"
}

function yearMonthToDatetimeRange(year, month) {
    let start = new Date()
    if (month === 0) {
        start.setFullYear(year-1)
        start.setMonth(11)
        start.setDate(1)
    }
    else {
        start.setFullYear(year)
        start.setMonth(month-1)
        start.setDate(1)
    }
    
    let end = new Date()
    if (month === 11) {
        end.setFullYear(year+1)
        end.setMonth(0)
        end.setDate(1)
    }
    else {
        end.setFullYear(year)
        end.setMonth(month+1)
        end.setDate(1)
    }

    return [start, end]
}

function previousMonth(year, month) {
    if (month === 1) return [year-1, 12];
    else return [year, month-1];
}

function nextMonth(year, month) {
    if (month === 12) return [year+1, 1];
    else return [year, month+1]
}

function _twoDigit(str) {
    if (str.length == 1) str = "0" + str;
    return str;
}


module.exports = 
{
    currentTimeString,
    timestampToString,
    yearMonthToDatetimeRange,
    previousMonth,
    nextMonth
};