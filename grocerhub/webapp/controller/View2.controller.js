sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("grocerhub.controller.View2", {
        onInit: function () {
            debugger
        },
        onNavigationChange: function (oEvent) {
            debugger;
            var oCurrentStep = oEvent.getParameter("step");
            var aSteps = this.byId("CreateProductWizard").getSteps();
            this._iSelectedStepIndex = aSteps.indexOf(oCurrentStep);
            this._updateButtonVisibility();
        },
        
        
             onNextButtonPress: function () {
            debugger;

            var pressedburtton = this.getView().byId("SegmentedButton").getSelectedKey();
            var bankAccount = this.getView().byId("bankAccount").getValue();
            var BeneficiaryName = this.getView().byId("BeneficiaryName").getValue();
            var bankname = this.getView().byId("bankName").getValue();
            var BeneficiaryNameValueState = this.getView().byId("BeneficiaryName").getValueState();
            var banknameValueState = this.getView().byId("bankName").getValueState();

            var CardHolderName = this.getView().byId("CardHolderName").getValue();
            var CardHolderNamestate = this.getView().byId("CardHolderName").getValueState();
            var creditCardNumber = this.getView().byId("creditCardNumber").getValue();
            var DP8 = this.getView().byId("DP8").getValue();
            var creditCardCVV = this.getView().byId("creditCardCVV").getValue();


            if (!this._oWizard) {
                this._oWizard = this.byId("CreateProductWizard");
            }
            if (this._iSelectedStepIndex === undefined) {
                this._iSelectedStepIndex = 0;
            }

            if (pressedburtton === "BankTransfer" && this._iSelectedStepIndex === 1 && (bankAccount === "" || BeneficiaryName === "" || bankname === "" || BeneficiaryNameValueState === "Error" || banknameValueState === "Error")) {
                MessageBox.error("Please Fill All Fields");
            } else if (pressedburtton === "CreditCard" && this._iSelectedStepIndex === 1 && (CardHolderName === "" || creditCardNumber === "" || DP8 === "" || creditCardCVV === "" || CardHolderNamestate === 'Error')) {
                MessageBox.error("Please Fill All Fields");
            }
            else {
                this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
                var oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex + 1];

                if (this._oSelectedStep && !this._oSelectedStep.bLast) {
                    this._oWizard.goToStep(oNextStep, true);
                    this._iSelectedStepIndex++;
                    this._oSelectedStep = oNextStep;
                } else {
                    this._oWizard.nextStep();
                    this._iSelectedStepIndex++;
                    this._oSelectedStep = oNextStep;
                }

                this._updateButtonVisibility();
            }
        },
        onPreviousButtonPress: function () {
            debugger;
            if (!this._oWizard) {
                this._oWizard = this.byId("CreateProductWizard");
            }
            if (!this._iSelectedStepIndex) {
                this._iSelectedStepIndex = 0;
            }

            this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
            var oPreviousStep = this._oWizard.getSteps()[this._iSelectedStepIndex - 1];

            if (this._oSelectedStep && this._iSelectedStepIndex > 0) {
                this._oWizard.goToStep(oPreviousStep, true);
                this._iSelectedStepIndex--;
                this._oSelectedStep = oPreviousStep;
            } else {
                this._iSelectedStepIndex = 0;
                this._oWizard.goToStep(this._oWizard.getSteps()[0], true);
                this._oSelectedStep = this._oWizard.getSteps()[0];
            }

            this._updateButtonVisibility();
        },
        _updateButtonVisibility: function () {
            debugger;
            if (!this._oWizard) {
                this._oWizard = this.byId("CreateProductWizard");
            }
            if (this._iSelectedStepIndex === undefined) {
                this._iSelectedStepIndex = 0;
            }

            var oPreviousButton = this.byId("onBackButtonPress");
            var oNextButton = this.byId("nextButton");
            var oSubmitButton = this.byId("SubmitButton");
            if (this._iSelectedStepIndex === 0) {
                oPreviousButton.setVisible(false);
            } else {
                oPreviousButton.setVisible(true);
            }

            if (this._iSelectedStepIndex === this._oWizard.getSteps().length - 1) {
                oNextButton.setEnabled(false);
                oSubmitButton.setEnabled(true);
            } else {
                oNextButton.setEnabled(true);
                oSubmitButton.setEnabled(false);
            }
        },
        onPaymentMethodSelect: function (oEvent) {
            debugger
            var selectedKey = oEvent.getSource().getSelectedKey();
            let Arr = ["Cash", "BankTransfer", "CreditCard", "CashOndelivery"]
            let idFrom = ["cashFields", "bankTransferFields", "creditCardFields", "cashOnDeliveryFields"]
            for (var i = 0; i < Arr.length; i++) {
                let bool = (Arr[i] === selectedKey);
                this.byId(idFrom[i]).setVisible(bool);
            }
        },
        onGoPage1: function () {
            debugger
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView1")
        },

        onchangeBeneficiaryName: function (oEvent) {
            debugger
            var sValue = oEvent.getParameter("newValue");
            var oInput = oEvent.getSource();
            var regex = /^[a-zA-Z\s]*$/;
            var errorMessage = "Only letters are allowed.";
            if (sValue === "") {
                oInput.setValueState("None");
                this.SupplierName = false;
            } else if (!regex.test(sValue)) {
                oInput.setValueState("Error");
                oInput.setValueStateText(errorMessage);
                this.SupplierName = false;
            } else {
                oInput.setValueState("None");
                this.SupplierName = true;
            }


        },
        onchangeBankAccountname: function () {
            debugger

        },
        onchangeCardholderName: function () {
            debugger
        },


        onpresssucess: function () {
            debugger;
            var arr = ["recipientName", "streetAddress", "city", "state", "postalCode", "country", "phone"];
            var isValid = true; 
            for (var i = 0; i < arr.length; i++) {
                var text = this.getView().byId(arr[i]).getValue();
                if (!text) {
                    isValid = false; 
                    break; 
                }
            }
        
            if (!isValid) {
                MessageBox.error("Please Fill All Fields");
            } else {

                var that=this;
                var pDialog2; 
                if (!pDialog2) {
                    pDialog2 = this.loadFragment({
                        name: "grocerhub.fragments.orderplaced"
                    });
                }
                pDialog2.then(function (oDialog2) {
                    oDialog2.open();
        
                    setTimeout(function () {
                        oDialog2.close();
                        oDialog2.destroy();


                    }, 4000);
                    
                });
            
         
            var oRouter = that.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView1")
            that._iSelectedStepIndex = 0;
            that._updateButtonVisibility();
            var ids = ["creditCardCVV","DP8","creditCardNumber","CardHolderName","bankAccount","BeneficiaryName","bankName","recipientName", "streetAddress", "city", "state", "postalCode", "country", "phone"];
            for(var z =0;z<ids.length;z++){
             that.getView().byId(ids[z]).setValue();
            }
            var oWizard =  that.getView().byId("CreateProductWizard")
            var oFirstStep= oWizard.getSteps()[0];
            oWizard.discardProgress(oFirstStep);
             var oCurrStep = that.getView().byId(that._currentStep);//this._currentStep is step you want to nav to
             oWizard.setCurrentStep(oCurrStep);
       
           
            that.getView().byId("FlexibleColumnLayout").setLayout("TwoColumnsMidExpanded");
             var oSplitApp =  that.getView().byId("NavContainer");
             oSplitApp.to(that.getView().byId("MasterPage1"));
             var oSplitAppdetails =  that.getView().byId("navContainerMid");
             oSplitAppdetails.to(that.getView().byId("PageMid1"))
                  ["objectlistdata","itemsData","cartDataList"].forEach(function(ele,v,arr){
                    that.getView().getModel("cartDataList").setData("");
                    that.getView().getModel("cartDataList").refresh(true);
                 
                })
             
        }

        },
        
        onDialogClose:function(oEvent){
            debugger
            oEvent.getSource().getParent().close();
            oEvent.getSource().getParent().destroy();

        },
       
    });
});