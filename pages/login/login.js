Page({
    data: {
        topTips: '',
        username: '',
        password: ''
    },
    showTopTips: function(tips){
        var that = this;
        this.setData({
            topTips: tips
        });
        setTimeout(function(){
            that.setData({
                topTips: ''
            });
        }, 3000);
    },
    onUsernameInput: function (e) {
        this.setData({
            username: e.detail.value
        })
    },
    onPasswordInput: function (e) {
        this.setData({
            password: e.detail.value
        })
    },
    onLoginTap: function (e) {
        if (this.data.username === ''){
            this.showTopTips('用户名不能为空');
            return;
        } else if (this.data.password === ''){
            this.showTopTips('密码不能为空');
            return;
        }

        wx.request({
            url: 'test.php', //仅为示例，并非真实的接口地址
            data: {
                x: '' ,
                y: ''
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res.data)
            }
        })
    }
});

// Page({
//     data: {
//     },
//     onLoad: function () {
//         wx.login({
//             success: function (res) {
//                 if (res.code) {
//                     wx.redirectTo({
//                         url: 'pages/login/login'
//                     })
//                 } else {
//                     console.log('获取用户登录态失败！' + res.errMsg)
//                 }
//             }
//         })
//     },
//     onReady: function () {
//
//     },
//     onShow: function () {
//
//     },
//     onHide: function () {
//
//     },
//     onUnload: function () {
//
//     }
// })