function formatNumber(n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}

export function formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    const t1 = [year, month, day].map(formatNumber).join('/')
    const t2 = [hour, minute, second].map(formatNumber).join(':')

    return `${t1} ${t2}`
}
//无用？和下面差那里？
export function timestampToTime(timestamp) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y + M + D;
}
//datetime时间戳转日期格式— — 开始
export function getFormatDate(mills) {
    var d = new Date(mills);
    var year = d.getFullYear();
    var day = d.getDate();
    var month = +d.getMonth() + 1;
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    var misec = d.getMilliseconds();
    var f = year + "-" + formate(month) + "-" + formate(day) + " " + formate(hour) + ":" + formate(minute) + ":" + formate(second);
    return f;
}

function formate(d) {
    return d > 9 ? d : '0' + d;
}
//— — 结束

//生成随机唯一UUID
export function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


export function formatPrice(value) {
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
    }
    //当12.3这种一位小数补一个0
    if (xsd.length > 1) {
        if (xsd[1].length < 2) {
            value = value.toString() + "0";
        }
        return value;
    }
}

export function isLogin() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
        return userInfo;
    } else {
        return false;
    }
}
export default {
    formatNumber,
    formatTime,
    formatPrice,
    isLogin,
    timestampToTime,
    getFormatDate,
    uuid
}