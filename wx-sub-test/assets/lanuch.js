
cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node
    },

    start () {
        wx.onMessage(data => {
            switch (data.message) {
                case 'Show':
                    this._show();
                    break;
                case 'Hide':
                    this._hide();
                    break;
            }
        });
    },

    _show () {
        let moveTo = cc.moveTo(0.5, 0, 73);
        this.display.runAction(moveTo);
    },

    _hide () {
        let moveTo = cc.moveTo(0.5, 0, 1000);
        this.display.runAction(moveTo);
    }
});
