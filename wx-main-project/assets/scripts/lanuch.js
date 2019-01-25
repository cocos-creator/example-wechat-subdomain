/**
 * wx api: https://developers.weixin.qq.com/minigame/dev/document/open-api/user-info/wx.createUserInfoButton.html
 */
cc.Class({
    extends: cc.Component,

    properties: {
        wxSubContextView: cc.Node,
        tips: cc.Label,

        avatar: cc.Sprite,
        nickName: cc.Label,

        readme: cc.Label,

        background: cc.Node
    },

    start () {
        this.loadReadme();
        this.initAction();
        this.initUserInfoButton();
    },

    initAction () {
        this._isShow = false;
        this.wxSubContextView.y = 1000;
        this._showAction = cc.moveTo(0.5, this.wxSubContextView.x, 110);
        this._hideAction = cc.moveTo(0.5, this.wxSubContextView.x, 1000);

        this.background.on('touchstart', this.onClick, this);
    },

    initUserInfoButton () {
        if (typeof wx === 'undefined') {
            return;
        }

        let systemInfo = wx.getSystemInfoSync();
        let width = systemInfo.windowWidth;
        let height = systemInfo.windowHeight;
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: 0,
                top: 0,
                width: width,
                height: height,
                lineHeight: 40,
                backgroundColor: '#00000000',
                color: '#00000000',
                textAlign: 'center',
                fontSize: 10,
                borderRadius: 4
            }
        });

        button.onTap((res) => {
            let userInfo = res.userInfo;
            if (!userInfo) {
                this.tips.string = res.errMsg;
                return;
            }

            this.nickName.string = userInfo.nickName;

            cc.loader.load({url: userInfo.avatarUrl, type: 'png'}, (err, texture) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.avatar.spriteFrame = new cc.SpriteFrame(texture);
            });

            wx.getOpenDataContext().postMessage({
                message: "User info get success."
            });

            this.wxSubContextView.runAction(this._showAction);
            this._isShow = true;

            button.hide();
            button.destroy();

        });
    },

    onClick () {
        this._isShow = !this._isShow;
        if (this._isShow) {
            this.wxSubContextView.runAction(this._showAction);
        }
        else {
            this.wxSubContextView.runAction(this._hideAction);
        }
    },


    onShowReadme () {
        this.readme.node.parent.active = true;
    },

    loadReadme () {
        cc.loader.loadRes('readme', cc.TextAsset, (err, res) => {
            this.readme.string = '\n' + res.text;
        });
        this.readme.node.on('touchstart' , () => {
            this.readme.node.parent.active = false;
        }, this);
    },
});
