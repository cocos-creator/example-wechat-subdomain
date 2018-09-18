
cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node,
        label: cc.Label,
        userBlock: cc.Node
    },

    start () {
        this._isShow = true;
        this._show = cc.moveTo(0.5, 0, 110);
        this._hide = cc.moveTo(0.5, 0, 1000);
        // the UserInfoButton is set position by screen size.
        let systemInfo =  wx.getSystemInfoSync();
        let width = systemInfo.windowWidth;
        let height = systemInfo.windowHeight;
        // https://developers.weixin.qq.com/minigame/dev/document/open-api/user-info/wx.createUserInfoButton.html
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '获取用户信息',
            style: {
                left: width * 0.33,
                top: height * 0.81,
                width: width * 0.13,
                height: height * 0.1,
                lineHeight: 40,
                backgroundColor: '#eeeeee',
                color: '#000000',
                textAlign: 'center',
                fontSize: 10,
                borderRadius: 3
            }
        });

        let userInfo = null;
        let _self = this;
        button.onTap((res) => {
            if (userInfo) return;
            switch(res.errMsg) {
                case 'getUserInfo:ok': 
                    userInfo = res.userInfo;
                    let nickName = userInfo.nickName;
                    let avatarUrl = userInfo.avatarUrl;
                    _self.setUserConfig(nickName, avatarUrl);

                    wx.getOpenDataContext().postMessage({
                        message: "User info get success."    
                    });
                default:
                    this.setTips(res.errMsg);
                    break;
            }
        });
    },

    onClick () {
        this._isShow = !this._isShow;
        if (this._isShow) {
            this.display.runAction(this._show);
        }
        else {
            this.display.runAction(this._hide);
        }
    },

    setUserConfig (nickName, avatarUrl) {
        let userAvatarSprite = this.userBlock.getChildByName('userPortrait').getComponentInChildren(cc.Sprite);
        let nickNameLabel = this.userBlock.getChildByName('userName').getComponent(cc.Label);

        nickNameLabel.string = nickName;
        cc.loader.load({
            url: avatarUrl,
            type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            userAvatarSprite.spriteFrame = new cc.SpriteFrame(texture);
        });
    },

    setTips (str) {
        this.label.string = str;
    }
});
