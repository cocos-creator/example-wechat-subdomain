
cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Sprite
    },

    start () {
        this._isShow = true;
        this.tex = new cc.Texture2D();
    },

    onClick () {
        this._isShow = !this._isShow;
        // 发消息给子域
        wx.postMessage({
            message: this._isShow ? 'Show' : 'Hide'
        })
    },

    _updaetSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },

    update () {
        this._updaetSubDomainCanvas();
    }

});
