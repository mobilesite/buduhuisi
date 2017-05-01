/**
 * App() 必须在 app.js 中注册，且不能注册多个。
 * 不要在定义于 App() 内的函数中调用 getApp() ，使用 this 就可以拿到 app 实例。
 * 不要在 onLaunch 的时候调用 getCurrentPage()，此时 page 还没有生成。
 * 通过 getApp() 获取实例之后，不要私自调用生命周期函数。
 */
App({
    onLaunch: function (path, query, scene) {
        //当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
    },
    onShow: function (path, query, scene) {
        //当小程序启动，或从后台进入前台显示，会触发 onShow
    },
    onHide: function () {
        //当小程序启动，或从前台进入后台显示，会触发 onHide
    },
    onError: function () {
        //当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
    },
    getUserInfo: function (cb) {
        var that = this;

        wx.getUserInfo({
            success: function (rs) {
                that.globalData.userInfo = rs.userInfo;
                typeof cb === 'function' && cb(that.globalData.userInfo);
            }
        })
    },
    globalData: {
        userInfo: null
    }
})