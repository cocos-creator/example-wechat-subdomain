
cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node
    },

    start () {
        this._isShow = true;
        this._show = cc.moveTo(0.5, 0, 110);
        this._hide = cc.moveTo(0.5, 0, 1000);
    },

    onClick () {
        this._isShow = !this._isShow;
        if (this._isShow) {
            this.display.runAction(this._show);
        }
        else {
            this.display.runAction(this._hide);
        }
    }
});
