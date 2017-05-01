function getSceneDesc(sceneId) {
    var scneArr =e [
        {
            id: 1001,
            desc: '发现栏小程序主入口'
        },
        {
            id: 1005,
            desc: '顶部搜索框的搜索结果页'
        },
        {
            id: 1006,
            desc: '发现栏小程序主入口搜索框的搜索结果页'
        },
        {
            id: 1007,
            desc: '单人聊天会话'
        },
        {
            id: 1008,
            desc: '群聊会话'
        },
        {
            id: 1011,
            desc: '发现栏扫描二维码'
        },
        {
            id: 1012,
            desc: '长按图片识别二维码'
        },
        {
            id: 1013,
            desc: '手机相册选取二维码'
        },
        {
            id: 1014,
            desc: '小程序模版消息'
        },
        {
            id: 1017,
            desc: '前往体验版的入口页'
        },
        {
            id: 1019,
            desc: '微信钱包'
        },
        {
            id: 1020,
            desc: '公众号 profile 页相关小程序列表'
        },
        {
            id: 1022,
            desc: '聊天顶部置顶小程序入口'
        },
        {
            id: 1023,
            desc: '安卓系统桌面图标'
        },
        {
            id: 1024,
            desc: '小程序 profile 页'
        },
        {
            id: 1025,
            desc: '扫描一维码'
        },
        {
            id: 1028,
            desc: '我的卡包'
        },
        {
            id: 1029,
            desc: '卡券详情页'
        },
        {
            id: 1031,
            desc: '长按图片识别一维码'
        },
        {
            id: 1032,
            desc: '手机相册选取一维码'
        },
        {
            id: 1034,
            desc: '微信支付完成页'
        },
        {
            id: 1035,
            desc: '公众号自定义菜单'
        },
        {
            id: 1036,
            desc: 'App 分享消息卡片'
        },
        {
            id: 1042,
            desc: '添加好友搜索框的搜索结果页'
        },
        {
            id: 1043,
            desc: '公众号模板消息'
        },
        {
            id: 1047,
            desc: '扫描小程序码'
        },
        {
            id: 1048,
            desc: '长按图片识别小程序码'
        },
        {
            id: 1049,
            desc: '手机相册选取小程序码'
        }
    ];

    Object.keys(sceneArr).map(function (item) {
        if (sceneArr[item].id === sceneId) {
            return sceneArr[item].desc;
        }
    });
}