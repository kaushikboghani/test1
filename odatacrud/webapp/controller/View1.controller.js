sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("odatacrud.controller.View1", {
            onInit: function () {

            },
            onAfterRendering: function () {
                debugger
                this.welcomeTo()
            },
            welcomeTo: function () {
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/ZLAUNCHUSERINFOSet", {
                    success: function (oData) {
                        debugger
                        this.getView().getModel("MainModel").setData(oData.results)
                        this.getView().getModel("MainModel").refresh(true);
                        // sap.m.MessageBox.success("Success")

                    }.bind(this),
                    error() {
                        // sap.m.MessageBox.error("error");
                    }
                })
            },


            getFilterPress: function () {
                BusyIndicator.show();
                const filterData = this.getView().getModel("Filter").getData();
                this.oFilters = [];
                Object.keys(filterData).forEach(key => {
                    if (!jQuery.isEmptyObject(filterData[key])) {
                        this.oFilters.push(new Filter(key, "EQ", filterData[key]));
                    }
                });
                var that = this;
                // Read the data from the OData service
                this.getView().getModel().read("/SupplierListSet", {
                    filters: this.oFilters,
                    success: function (oData) {
                        that.getView().getModel("supplier").setData(oData.results);
                        that.getView().getModel("supplier").refresh(true);
                        BusyIndicator.hide();

                    },
                    error: function (oError) {
                        BusyIndicator.hide();

                        sap.m.MessageBox.Error("Failed to load data. Please check the OData service configuration.");
                    }
                });


            },


            onPressDelete: function (oEvent) {
                debugger;
                var that = this;
                // var sPath = oEvent.getSource().getBindingContext("MainModel").getPath();
                // var oModel = that.getView().getModel();
                // var sUserid = oModel.getProperty(sPath + "/Userid"); 
                // var sEntityPath = "/ZLAUNCHUSERINFOSet('" + sUserid + "')";

                // oModel.remove(sEntityPath, {
                //     success: function () {
                //         // sap.m.MessageBox.success("Record deleted successfully.");
                //         that.onAfterRendering(); 
                //     },
                //     error: function (oError) {
                //         // sap.m.MessageBox.error("Failed to delete the record.");
                //         console.error(oError);
                //     }
                // });



                var oButton = oEvent.getSource();
                var oContext = oButton.getBindingContext("MainModel");
                var path = "/ZLAUNCHUSERINFOSet('" + oEvent.getSource().getBindingContext("MainModel").getObject().Userid + "')";
                var oModel = that.getView().getModel();

                oModel.remove(path, {
                    success: function () {
                        // sap.m.MessageBox.success("Deleted data successfully.");
                        that.welcomeTo()
                        that.getView().getModel("MainModel").refresh(true);
                    },
                    error: function (error) {
                        // sap.m.MessageBox.error("Deletion failed.");
                        console.error(error);
                    }
                })
            },

            onAddpress: function () {
                debugger
                var pDialog2
                if (!pDialog2) {
                    pDialog2 = this.loadFragment({
                        name: "odatacrud.fragments.add",
                    });
                }
                pDialog2.then(function (oDialog2) {
                    oDialog2.open()
                });
            },
            onEditpress: function (oEvent) {
                debugger
                var odata = oEvent.getSource().getBindingContext("MainModel").getObject();
                this.getOwnerComponent().getModel("editdata").setData(odata)
                var pDialog3
                if (!pDialog3) {
                    pDialog3 = this.loadFragment({
                        name: "odatacrud.fragments.edit",
                    });
                }
                pDialog3.then(function (oDialog3) {
                    oDialog3.open()
                });
            },
            onAddpress: function () {
                debugger
                var pDialog2
                if (!pDialog2) {
                    pDialog2 = this.loadFragment({
                        name: "odatacrud.fragments.add",
                    });
                }
                pDialog2.then(function (oDialog2) {
                    oDialog2.open()
                });
            },
            onCloseDialog: function (oEvent) {
                oEvent.getSource().getParent().close()
                oEvent.getSource().getParent().destroy()
            },



            onAddDetails: function () {
                debugger
                var that = this;
                var Userid = this.getView().byId("Userid").getValue();
                var Username = this.getView().byId("Username").getValue();
                var Useremail = this.getView().byId("Useremail").getValue();
                var Userpass = this.getView().byId("Userpass").getValue();
                var Userdesign = this.getView().byId("Userdesign").getValue();
                var oEntry = {
                    "Userid": Userid,
                    "Username": Username,
                    "Useremail": Useremail,
                    "Userpass": Userpass,
                    "Userdesign": parseInt(Userdesign)
                };

                var oModel = this.getView().getModel();
                oModel.create("/ZLAUNCHUSERINFOSet", oEntry, {
                    success: function () {
                        // MessageBox.success("Data added successfully!");
                        that.welcomeTo();
                    },
                    error: function () {
                        // MessageBox.error("Failed to add data.");
                    }
                });

                this.getView().byId("createDialog").close();
                this.getView().byId("createDialog").destroy();
            },



        });
    });
