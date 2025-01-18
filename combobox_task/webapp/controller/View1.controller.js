sap.ui.define([
  "./Basecontroller",
    "sap/ui/core/Fragment",
    "sap/m/Popover"
], (Basecontroller, Fragment, Popover) => {
    "use strict";

    return Basecontroller.extend("comboboxtask.controller.View1", {
        onInit() {
        },

        onSelectAll: function (oEvent) {
            var bSelected = oEvent.getParameter("selected");
            var oList = this.getView().byId("listId");
            var aItems = oList.getItems();
            var oInput = this.getView().byId("inputid");
            for (var i = 0; i < aItems.length; i++) {
                oList.setSelectedItem(aItems[i], bSelected);
            }
            if (bSelected) {
                var aSelectedTexts = [];
                for (var j = 0; j < aItems.length; j++) {
                    var sTitle = aItems[j].getTitle();
                    aSelectedTexts.push(sTitle);
                }
                oInput.removeAllTokens();
                for (var k = 0; k < aSelectedTexts.length; k++) {
                    var oToken = new sap.m.Token({
                        text: aSelectedTexts[k]
                    });
                    oInput.addToken(oToken);
                }
            } else {
                oInput.removeAllTokens();
            }
        },

        onSelectListData: function (oEvent) {
            var oList = this.getView().byId("listId");
            var selectedItems = oList.getSelectedItems();
            var oInput = this.getView().byId("inputid");
            var aSelectedTexts = [];
            for (var i = 0; i < selectedItems.length; i++) {
                var oItem = selectedItems[i];
                var sTitle = oItem.getTitle();
                aSelectedTexts.push(sTitle);
            }
            oInput.removeAllTokens();
            for (var j = 0; j < aSelectedTexts.length; j++) {
                var oToken = new sap.m.Token({
                    text: aSelectedTexts[j]
                });
                oInput.addToken(oToken);

            }
            var aAllItems = oList.getItems().length;
            var aSelectedItemsCount = oList.getSelectedItems().length;
            // this.getView().byId("selectAll").setSelected(aAllItems === aSelectedItemsCount);
            if (aAllItems === 0) {
                this.getView().byId("selectAll").setSelected(false);
            } else {
                this.getView().byId("selectAll").setSelected(aAllItems === aSelectedItemsCount);
            }
        },

        onTokenRemove: function (oEvent) {
            debugger
            var oList = this.getView().byId("listId");
            var selectedItems = oList.getSelectedItems();
            var oInput = this.getView().byId("inputid");
            var oToken = oEvent.getParameter("token");

            var tokenText = oEvent.getParameters("token").removedTokens[0].mProperties.text;

            for (var i = 0; i < selectedItems.length; i++) {
                var oItem = selectedItems[i];
                var sTitle = oItem.getTitle();
                if (sTitle === tokenText) {
                    oItem.setSelected(false);
                }
            }
            var aAllItems = oList.getItems().length;
            var aSelectedItemsCount = oList.getSelectedItems().length;
            // this.getView().byId("selectAll").setSelected(aAllItems === aSelectedItemsCount);
            if (aAllItems === 0) {
                this.getView().byId("selectAll").setSelected(false);
            } else {
                this.getView().byId("selectAll").setSelected(aAllItems === aSelectedItemsCount);
            }
        },

        onInputValueChange: function (oEvent) {
            debugger
          
            var oInput = this.getView().byId("inputid");
            var sNewValue = oEvent.getParameter("value")
            var oTokens = oInput.getTokens();
           
           

       
            var oList = this.getView().byId("listId");
            var aItems = oList.getItems();
            var oBinding = oList.getBinding("items");
            var sNewValue1 = oEvent.getParameter("value").toLowerCase();
            for (var i = 0; i < aItems.length; i++) {
                var oItem = aItems[i];
                var sTitle = oItem.getTitle();

                var bTokenExists = false;
                for (var j = 0; j < oTokens.length; j++) {
                    if (oTokens[j].getText() === sTitle) {
                        bTokenExists = true;
                        break;
                    }
                }

                if (sTitle === sNewValue && !bTokenExists) {
                    oList.setSelectedItem(oItem, true);
                    var oToken = new sap.m.Token({
                        text: sTitle
                    });
                    oInput.addToken(oToken);
                    oInput.setValue("");
                    break;
                }
            }

            var aAllItems = aItems.length;
            var aSelectedItemsCount = oList.getSelectedItems().length;
            if (aAllItems === 0) {
                this.getView().byId("selectAll").setSelected(false);
            } else {
                this.getView().byId("selectAll").setSelected(aAllItems === aSelectedItemsCount);
            }
        },







    });
});
