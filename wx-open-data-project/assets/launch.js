//
// api: https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getUserInfo.html
//
cc.Class({
    extends: cc.Component,

    properties: {
        tips: cc.Label,
        content: cc.Node,
        prefab: cc.Prefab,

    },

    start () {

        if (typeof wx === 'undefined') {
            return;
        }

        wx.onMessage( data => {
            if (data.message) {
                console.log(data.message);
            }
        });

        this.initTips();
        this.initUserInfo();
        this.initFriendInfo();
    },

    initTips () {
        let renderTypeStr = 'Canvas';
        if (cc.game.renderType === cc.game.RENDER_TYPE_WEBGL) {
            renderTypeStr = 'WEBGL';
        }
        this.tips.string = `开放数据域当前支持 ${renderTypeStr} 渲染模式`;
    },

    initUserInfo () {
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            lang: 'zh_CN',
            success: (res) => {
                this.createUserBlock(res.data[0]);
            },
            fail: (res) => {
                console.error(res);
            }
        });
    },

    initFriendInfo () {
        wx.getFriendCloudStorage({
            success: (res) => {
                for (let i = 0; i < res.data.length; ++i) {
                    this.createUserBlock(res.data[i]);
                }
            },
            fail: (res) => {
                console.error(res);
            }
        });
    },

    createUserBlock (user) {
        let node = cc.instantiate(this.prefab);
        node.parent = this.content;
        node.x = 0;

        // set nickName
        let userName = node.getChildByName('userName').getComponent(cc.Label);
        userName.string = user.nickName || user.nickname;

        // set avatar
        cc.loader.load({url: user.avatarUrl, type: 'png'}, (err, texture) => {
            if (err) console.error(err);
            let userIcon = node.getChildByName('mask').children[0].getComponent(cc.Sprite);
            userIcon.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

});
