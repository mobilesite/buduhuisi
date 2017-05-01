Page({
    data: {
        //页面的初始数据
        iconSize: [20, 30, 40, 50, 60, 70],
        iconColor: [
            'red', 'orange', 'yellow', 'green', 'rgb(0,255,255)', 'blue', 'purple'
        ],
        iconType: [
            'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
        ]
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
    },
    onReady: function () {
        // 页面初次渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面卸载
    },
    onPullDownRefresh(){
        // 用户下拉页面刷新
    },
    onReachBottom(){
        // 用户上拉至已触及底部
    },
    onShareAppMessage(){
        // 用户点击右上角分享
    }
})