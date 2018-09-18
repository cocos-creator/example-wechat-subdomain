cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        prefab: cc.Prefab
    },

    start () {
        let _self = this;

        wx.onMessage( data => {
            console.log(data.message);
        });

        // https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getUserInfo.html
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            lang: 'zh_CN',
            success: (res) => {
                console.log('success', res.data);
                let userInfo = res.data[0];
                _self.createUserBlock(userInfo);
            },
            fail: (res) => {
                reject(res);
            }
        });
        
        // https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getFriendCloudStorage.html
        wx.getFriendCloudStorage({
            success: function (res) {
                for (let i = 0; i < 6; i++) {
                    let friendInfo = res.data[i];
                    if (!friendInfo) {
                        _self.createPrefab();
                        continue;
                    }
                    _self.createUserBlock(friendInfo);
                }
            },
            fail: function (res) {
                console.error(res);
            }
        });
    },

    createUserBlock (user) {
        let node = this.createPrefab();
        // getUserInfo will return the nickName, getFriendCloudStorage will return the nickname.
        let nickName = user.nickName ? user.nickName : user.nickname;
        let avatarUrl = user.avatarUrl;

        let userName = node.getChildByName('userName').getComponent(cc.Label);
        let userIcon = node.getChildByName('mask').children[0].getComponent(cc.Sprite);

        userName.string = nickName;
        console.log(nickName + '\'s info has been getten.');
        cc.loader.load({
            url: avatarUrl, type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            userIcon.spriteFrame = new cc.SpriteFrame(texture);
        });                   
    },

    createPrefab () {
        let node = cc.instantiate(this.prefab);
        node.parent = this.content;
        return node;
    }

});
