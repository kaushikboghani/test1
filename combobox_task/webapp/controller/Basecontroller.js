sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
], function (Controller,Fragment) {
    "use strict";
    return Controller.extend("comboboxtask.controller.Basecontroller", {
        
        onpressvaluehelpinput: function (oEvent) {
            var oSource = oEvent.getSource();
            if (!this._oPopover) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "comboboxtask.fragments.pop",
                    controller: this
                }).then(function (oPopover) {
                    this._oPopover = oPopover;
                    this.getView().addDependent(oPopover);
                    oPopover.openBy(oSource);
                }.bind(this));
            } else {
                this._oPopover.openBy(oSource);
            }

        },
})
})