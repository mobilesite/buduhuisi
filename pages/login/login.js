Page({
    data: {},
    onLoad: function () {
        wx.login({
            success: function (res) {
                if (res.code) {
                    wx.redirectTo({
                        url: 'pages/login/login'
                    })
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        })
    },
    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {

    },
    onUnload: function () {

    }
})