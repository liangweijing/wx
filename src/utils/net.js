// import wx from 'wx'; //不需要引用微信小程序wx对象
// const host = "http://10.22.234.201:8080" 
const host = 'http://127.0.0.1:8090'
    // const host = 'http://172.20.10.6:8080'
    // const host = 'http://192.168.43.115:8080'


function request(url, method, data, header = {}) {
    wx.showLoading({
        title: '正在加载中....'
    })
    return new Promise((resolve, reject) => {
        wx.request({
            url: host + url,
            method: method,
            data: data,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                wx.hideLoading();
                resolve(res.data)
            },
            fail: function(res) {
                wx.hideLoading();
                reject(res);
            },
            complete: function(res) {
                wx.hideLoading();
            }
        })
    })
}

//封装get方法
function get(obj) {
    return request(obj.url, 'GET', obj.data)
}
//封装post方法
function post(obj) {
    return request(obj.url, 'POST', obj.data)
}


export default {
    request,
    get,
    post,
    host
}