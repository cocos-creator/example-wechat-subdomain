cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        prefab: cc.Prefab
    },

    start () {
        let _self = this;

        wx.onMessage( data => {
            if (data.nickName && data.avatarUrl) {
                _self.showUserData(data.nickName, data.avatarUrl);
                // fill the content by the blank targets.
                (function () {
                    for (let i = 0; i < 5; i++) {
                        let node = cc.instantiate(_self.prefab);
                        node.parent = _self.content;
                    }
                })();
            };
        });

        wx.getFriendCloudStorage({
            success: function (res) {
                for (let i = 0; i < 5; i++) {
                    let friend = res.data[i];
                    if (!_self.preSettingData(friend, ' stop getting friends\' infos')) {
                        return;
                    }
                }
            },
            fail: function (res) {
                console.log(res);
            }
        });
    },

    showUserData (nickName, avatarUrl) {
        let node = cc.instantiate(this.prefab);
        node.parent = this.content;
        let userName = node.getChildByName('userName').getComponent(cc.Label);
        let userIcon = node.getChildByName('mask').children[0].getComponent(cc.Sprite);

        userName.string = nickName;
        console.log(nickName + '\'s info has been getten.');
        cc.loader.load({
            url: avatarUrl, type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            console.log(texture);
            userIcon.spriteFrame = new cc.SpriteFrame(texture);
        });                   
    },
    
    preSettingData (user, str) {
        if (!user) {
            console.log(str);
            return false;
        }
        let nickName = user.nickname;
        let avatarUrl = user.avatarUrl;
        this.showUserData(nickName, avatarUrl);
        return true;
    }
});
