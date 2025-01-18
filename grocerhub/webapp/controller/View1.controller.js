sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller,MessageBox) => {
    "use strict";

    return Controller.extend("grocerhub.controller.View1", {
        onInit() {
            debugger
            this.getOwnerComponent().getModel("cartData").setData({ "cartdata": [] });
            var data = this.getOwnerComponent().getModel("category").getData();
            var arr = []
      
            data.Categories.forEach(element => {
                element.products.forEach(item=>{
                    arr.push(item.name)
                }) 
            });
            var oModel = this.getOwnerComponent().getModel("category");
            var categories = oModel.getProperty("/Categories");
            var allProducts = [];
            for (var i = 0; i < categories.length; i++) {
                allProducts = allProducts.concat(categories[i].products);
            }
            var randomProducts = [];
            var productsCount = allProducts.length;
            while (randomProducts.length < 8) {
                var randomIndex = Math.floor(Math.random() * productsCount);
                var randomProduct = allProducts[randomIndex];
                if (!randomProducts.includes(randomProduct)) {
                    randomProducts.push(randomProduct);
                }
            }
            this.getOwnerComponent().getModel("BestSeller").setProperty("/products", randomProducts);
            this.getOwnerComponent().getModel("BestSeller").refresh(true);
        },  
        onAfterRendering() {
            debugger
            var oCarousel = this.byId("autoScrollCarousel");
            var iCurrentPage = 0;
            setInterval(function () {
                iCurrentPage = (iCurrentPage + 1) %  oCarousel.getPages().length;
                oCarousel.setActivePage(oCarousel.getPages()[iCurrentPage]);
            }, 3000);
            this.getView().getModel("BestSeller").setProperty("/visiblePages", 3);
            this.getView().getModel("BestSeller").refresh(true);
            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/Subtotal");
            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/Shipping", 50);
            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/tax", 5);
        },

        onItemPress: function (oEvent,productId="") {
            debugger
            var oSplitApp = this.byId("NavContainer"),MainData;
            oSplitApp.to(this.getView().byId("MasterPage2"));
            var oSelectData = oEvent?.getSource()?.getBindingContext("category")?.getObject();
            this.getOwnerComponent().getModel("category").getData().Categories.forEach(ele=>{
                ele.products.forEach(item=>{
                    if(item.productId == productId ){
                        MainData = ele
                    }
                })
            })
            this.getOwnerComponent().getModel("objectlistdata").setData(oEvent ? oSelectData : MainData)
        },
        onpressmaster1: function (oEvent) {
            debugger
            var oSplitApp = this.byId("NavContainer");
            oSplitApp.to(this.getView().byId("MasterPage1"));
            var oDetailspage = this.byId("navContainerMid");
            oDetailspage.to(this.getView().byId("PageMid1"));

        },
        OnItemPressObject: function (oEvent) {
            debugger
            // this.getOwnerComponent().getModel("itemsData").setData()
            var sData = oEvent.getSource().getBindingContext("objectlistdata").getObject();
            this.getOwnerComponent().getModel("itemsData").setData(sData);
            var oSplitApp = this.byId("navContainerMid");
            oSplitApp.to(this.getView().byId("PageMid2"));
        },

        onPressNavigatePage1: function () {
            debugger
            var oSplitApp = this.byId("navContainerMid");
            oSplitApp.to(this.getView().byId("PageMid1"))
            var oSplitApp = this.byId("NavContainer");
            oSplitApp.to(this.getView().byId("MasterPage1"))

        },
        onPressCart: function (oEvent) {
            debugger
            var oButton = oEvent.getSource().getPressed()
            if (oButton) {
                debugger
                this.byId("FlexibleColumnLayout").setLayout("ThreeColumnsMidExpanded");
                this.getView().getModel("BestSeller").setProperty("/visiblePages", 2);
            }
            else {
                this.byId("FlexibleColumnLayout").setLayout("TwoColumnsMidExpanded");
                this.getView().getModel("BestSeller").setProperty("/visiblePages", 3);
            }
           this.getView().getModel("BestSeller").refresh(true)
        },
        onclosecart: function (oEvent) {
            debugger
            var oButton = this.getView().byId("onpresscartid").getPressed();
            if (oButton) {
                debugger
                this.byId("FlexibleColumnLayout").setLayout("TwoColumnsMidExpanded");
                this.getView().byId("onpresscartid").setPressed(false);
                this.getView().getModel("BestSeller").setProperty("/visiblePages", 3);
                this.getView().getModel("BestSeller").refresh(true)
            }
            else {
                this.byId("FlexibleColumnLayout").setLayout("ThreeColumnsMidExpanded");
            }


        },

        onAddToCartPress: function (oEvent) {
            debugger
            var bPath = oEvent.getSource().getParent().getParent().getParent().getBindingContext("BestSeller").sPath.split("/").pop();
            var data = this.getOwnerComponent().getModel("BestSeller").getData().products[parseInt(bPath)];
            var price = this.getOwnerComponent().getModel("BestSeller").getProperty("/products/" + parseInt(bPath) + "/price");
            var offer = this.getOwnerComponent().getModel("BestSeller").getProperty("/products/" + parseInt(bPath) + "/offer");
            var sproductId = this.getOwnerComponent().getModel("BestSeller").getProperty("/products/" + parseInt(bPath) + "/productId");
            var parprice = parseInt(offer);
            var quantity = 1;
            var finalPrice = price * quantity;
            if (parprice) {
                finalPrice = finalPrice - (finalPrice * (parprice / 100));
            }
            data.finalPrice = finalPrice;
            this.getOwnerComponent().getModel("cartData").getData().cartdata.push(data);
            this.getOwnerComponent().getModel("cartData").refresh(true);
            var oModel = this.getOwnerComponent().getModel("category").getData();
            for (var i = 0; i < oModel.Categories.length; i++) {
                for (var j = 0; j < oModel.Categories[i].products.length; j++) {
                    if (oModel.Categories[i].products[j].productId === sproductId) {
                        this.getOwnerComponent().getModel("category").setProperty("/Categories/" + i + "/products/" + j + "/visiblestepInput", true);
                        this.getOwnerComponent().getModel("category").setProperty("/Categories/" + i + "/products/" + j + "/visible", false);
                        this.getOwnerComponent().getModel("category").refresh(true);
                        this.getOwnerComponent().getModel("cartData").refresh(true);
                        this.getOwnerComponent().getModel("itemsData").refresh(true);
                    }
                }
            }
            this.getOwnerComponent().getModel("BestSeller").setProperty("/products/" + parseInt(bPath) + "/visible", false);
            this.getOwnerComponent().getModel("BestSeller").refresh(true);
            var datalength = this.getOwnerComponent().getModel("cartData").getData().cartdata.length
            this.getView().byId("badge").setValue(datalength);



            var zModel = this.getView().getModel("cartData").getData().cartdata;

            if (zModel === "") {
                debugger;
            } else {
                var Subtotal = 0;
                for (var j = 0; j < zModel.length; j++) {
                    debugger;
                    Subtotal += zModel[j].finalPrice;
                }
                //  console.log("Total Final Price:", totalPrice);
            }



            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/Subtotal", Subtotal);
            this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);
            var subtotalprice = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Subtotal");
            var Shipping = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Shipping");
            var tax = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/tax");

            var taxPrice = (subtotalprice * tax) / 100;
            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/taxPrice", taxPrice)
            var GrandTotal = subtotalprice + taxPrice + Shipping;
            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/GrandTotal", GrandTotal);
            this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);


        },



        onQuantityChange: function (oEvent) {
            debugger
            // var stepInput = oEvent.getSource().getValue();
            // var price = oEvent.getSource().getParent().getBindingContext("cartData").getObject().price
            // var total = stepInput * price;
            // oEvent.getSource().getParent().getBindingContext("cartData").getObject().totalprice = total
            // this.getView().getModel("cartData").refresh(true);
            var stock = oEvent.getSource().getParent().getBindingContext("cartData").getObject().stock;
            var stepInput = oEvent.getSource().getValue();
            if(stock<=stepInput) {
                MessageBox.error("Stock is Not Available")
                oEvent.getSource().setValue(stock)
                return 
            }
            var price = oEvent.getSource().getParent().getBindingContext("cartData").getObject().price;

            var total = stepInput * price;
            oEvent.getSource().getParent().getBindingContext("cartData").getObject().totalPrice = total;
            this.getView().getModel("cartData").refresh(true);

            var ototalprice = oEvent.getSource().getParent().getBindingContext("cartData").getObject().totalPrice;
            var ooffer = oEvent.getSource().getParent().getBindingContext("cartData").getObject().offer;
            var parseIntpoffer = parseInt(ooffer);

            if (parseIntpoffer) {
                var finalPrice = ototalprice - (total * (parseIntpoffer / 100));


                var context = oEvent.getSource().getParent().getBindingContext("cartData");
                var cartItem = context.getObject();

                // Set the finalPrice directly
                cartItem.finalPrice = finalPrice;

                // Refresh the model to reflect the changes
                this.getView().getModel("cartData").refresh(true);
            }
            var data = oEvent.getSource().getParent().getBindingContext("cartData").getObject().productId
            var oModel = this.getOwnerComponent().getModel("category").getData();
            for (var i = 0; i < oModel.Categories.length; i++) {
                for (var j = 0; j < oModel.Categories[i].products.length; j++) {
                    if (oModel.Categories[i].products[j].productId === data) {
                        this.getOwnerComponent().getModel("category").setProperty("/Categories/" + i + "/products/" + j + "/quantity", stepInput);
                        this.getOwnerComponent().getModel("category").refresh(true);
                        this.getOwnerComponent().getModel("cartData").refresh(true);
                        this.getOwnerComponent().getModel("itemsData").refresh(true);
                    }
                }
            }

            var zModel = this.getView().getModel("cartData").getData().cartdata;

            if (zModel === "") {
                debugger;
            } else {
                var Subtotal = 0;
                for (var j = 0; j < zModel.length; j++) {
                    debugger;
                    Subtotal += zModel[j].finalPrice;
                }
                // console.log("Total Final Price:");
            }
            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/Subtotal", Subtotal)
            var subtotalprice = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Subtotal");
            var Shipping = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Shipping");
            var tax = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/tax");

            var taxPrice = (subtotalprice * tax) / 100;
            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/taxPrice", taxPrice)
            var GrandTotal = subtotalprice + taxPrice + Shipping;
            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/GrandTotal", GrandTotal);
            this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);
            this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);


        },


        onQuantityChangeinproductDetails: function (oEvent) {
            debugger
            var stock =this.getOwnerComponent().getModel("cartData").getData().stock;
            var steps = oEvent.getSource().getValue();
            if(stock<=steps) {
                new sap.m.MessageBox.error("Stock is Not Available")
                oEvent.getSource().setValue(stock)
                return 
            }
            //  this.getOwnerComponent().getModel("itemsData").setProperty("/quantity", steps);
            var model = this.getOwnerComponent().getModel("cartData").getData().cartdata;
            for (var k = 0; k < model.length; k++) {
                var data = model[k].productId;
                var oModel = this.getOwnerComponent().getModel("category").getData();
                for (var i = 0; i < model.length; i++) {
                    for (var j = 0; j < oModel.Categories[i].products.length; j++) {
                        if (oModel.Categories[i].products[j].productId === data) {
                            this.getOwnerComponent().getModel("category").setProperty("/Categories/" + i + "/products/" + j + "/quantity", steps);
                            this.getOwnerComponent().getModel("category").refresh(true);
                            this.getOwnerComponent().getModel("cartData").refresh(true);
                        }
                    }
                }

            }

            var price = this.getOwnerComponent().getModel("itemsData").getData().price;
            var total = steps * price;
            this.getOwnerComponent().getModel("itemsData").getData().totalPrice = total;
            this.getView().getModel("cartData").refresh(true);

            var ototalprice = this.getOwnerComponent().getModel("itemsData").getData().totalPrice
            var ooffer = this.getOwnerComponent().getModel("itemsData").getData().offer;
            var parseIntpoffer = parseInt(ooffer);
            var productId = this.getOwnerComponent().getModel("itemsData").getData().productId;

            if (parseIntpoffer) {
                var finalPrice = ototalprice - (total * (parseIntpoffer / 100));
                var cartItem = this.getOwnerComponent().getModel("cartData").getData().cartdata;
                for (var z = 0; z < cartItem.length; z++) {
                    if (cartItem[z].productId === productId) {
                        cartItem[z].finalPrice = finalPrice;
                    }
                }

                // Refresh the model to reflect the changes
                this.getView().getModel("cartData").refresh(true);
                var zModel = this.getView().getModel("cartData").getData().cartdata;

                if (zModel === "") {
                    debugger;
                } else {
                    var Subtotal = 0;
                    for (var j = 0; j < zModel.length; j++) {
                        debugger;
                        Subtotal += zModel[j].finalPrice;
                    }
                    // console.log("Total Final Price:");
                }
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/Subtotal", Subtotal)
                var subtotalprice = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Subtotal");
                var Shipping = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Shipping");
                var tax = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/tax");

                var taxPrice = (subtotalprice * tax) / 100;
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/taxPrice", taxPrice)
                var GrandTotal = subtotalprice + taxPrice + Shipping;
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/GrandTotal", GrandTotal);
                this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);
                this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);
            }



        },
        onDeleteCartItem: function (oEvent) {
            debugger;
            // sap.m.MessageBox.confirm(
            //     "Are you sure you want to remove this item from the cart?",
            //     {
            //         icon: sap.m.MessageBox.Icon.WARNING,
            //         title: "Delete Item from Cart",
            //         actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
            //         onClose: function(oAction) {
            // if (oAction === sap.m.MessageBox.Action.OK) {

            var data = oEvent.getSource().getParent().getBindingContext("cartData").sPath.split("/").pop();
            var medicineStockModel = this.getView().getModel("cartData");
            var currentVisibility = this.getOwnerComponent().getModel("cartData").getProperty("/cartdata/" + data + "/productId");
            var bestsellerdata = this.getOwnerComponent().getModel("BestSeller").getData().products;
            for (var i = 0; i < bestsellerdata.length; i++) {

                if (bestsellerdata[i].productId === currentVisibility) {
                    this.getOwnerComponent().getModel("BestSeller").setProperty("/products/" + i.toString() + "/visible", true);
                    this.getOwnerComponent().getModel("BestSeller").refresh(true)
                }
            }
            var medicines = medicineStockModel.getProperty("/cartdata");
            medicines.splice(data, 1);
            medicineStockModel.setProperty("/cartdata", medicines);
            var datalength = this.getOwnerComponent().getModel("cartData").getData().cartdata.length
            this.getView().byId("badge").setValue(datalength)
            //             }
            //         }
            //     }
            // );




            var oModel = this.getOwnerComponent().getModel("category").getData();
            for (var i = 0; i < oModel.Categories.length; i++) {
                for (var j = 0; j < oModel.Categories[i].products.length; j++) {
                    if (oModel.Categories[i].products[j].productId === currentVisibility) {
                        this.getOwnerComponent().getModel("category").setProperty("/Categories/" + i + "/products/" + j + "/visible", true);
                        this.getOwnerComponent().getModel("category").setProperty("/Categories/" + i + "/products/" + j + "/quantity", 1);
                        this.getOwnerComponent().getModel("category").setProperty("/Categories/" + i + "/products/" + j + "/visiblestepInput", false);
                        this.getOwnerComponent().getModel("category").refresh(true);
                        this.getOwnerComponent().getModel("itemsData").refresh(true);
                    }
                }
            }

            var zModel = this.getView().getModel("cartData").getData().cartdata;

            if (zModel.length === 0) {
                debugger;
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/Subtotal", 0)
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/Shipping", 50)
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/taxPrice", 0)
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/GrandTotal", 0)
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/tax", 5)
                this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);

            } else {
                var Subtotal = 0;
                for (var j = 0; j < zModel.length; j++) {
                    debugger;
                    Subtotal += zModel[j].finalPrice;
                }


                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/Subtotal", Subtotal)
                var subtotalprice = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Subtotal");
                var Shipping = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Shipping");
                var tax = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/tax");

                var taxPrice = (subtotalprice * tax) / 100;
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/taxPrice", taxPrice)
                var GrandTotal = subtotalprice + taxPrice + Shipping;
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/GrandTotal", GrandTotal);
                this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);
                this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);
            }
        },
        onpressproductreemovecart: function (oEvent) {
            debugger
            var odata = this.getOwnerComponent().getModel("cartData").getData().cartdata;
            var datamodelitems = this.getOwnerComponent().getModel("itemsData").getData().productId;
            for (var i = 0; i < odata.length; i++) {
                var dataid = odata[i].productId
                if (dataid === datamodelitems) {

                    odata.splice(i, 1);
                    i--;
                }
                var bestsellecrmodel = this.getOwnerComponent().getModel("BestSeller").getData();
                for (var m = 0; m < bestsellecrmodel.length; m++) {
                    if (bestsellecrmodel[i].productId === datamodelitems) {
                        bestsellerData[m].visible = true;
                    } else {
                        bestsellerData[m].visible = false;
                    }
                }
                var oModel = this.getOwnerComponent().getModel("category").getData();
                for (var t = 0; t < oModel.Categories.length; t++) {
                    for (var j = 0; j < oModel.Categories[t].products.length; j++) {
                        if (oModel.Categories[t].products[j].productId === datamodelitems) {
                            this.getOwnerComponent().getModel("category").setProperty("/Categories/" + t + "/products/" + j + "/visiblestepInput", false);
                            this.getOwnerComponent().getModel("category").setProperty("/Categories/" + t + "/products/" + j + "/visible", true);
                            this.getOwnerComponent().getModel("category").setProperty("/Categories/" + t + "/products/" + j + "/quantity", 1);
                            this.getOwnerComponent().getModel("category").refresh(true);
                            this.getOwnerComponent().getModel("cartData").refresh(true);
                            this.getOwnerComponent().getModel("itemsData").refresh(true);
                            this.getOwnerComponent().getModel("BestSeller").refresh(true);
                            break;
                        }
                    }
                }





            }
            this.getOwnerComponent().getModel("itemsData").refresh(true);
            this.getOwnerComponent().getModel("cartData").refresh(true);
            var svalue = this.getOwnerComponent().getModel("cartData").getData().cartdata.length
            this.getView().byId("badge").setValue(svalue);


            // var zModel = this.getView().getModel("cartData").getData().cartdata;

            // if (zModel === "") {
            //     debugger;
            // } else {
            //     var Subtotal = 0;
            //     for (var j = 0; j < zModel.length; j++) {
            //         debugger;
            //         Subtotal += zModel[j].finalPrice;
            //     }
            //     // console.log("Total Final Price:");
            // }
            // this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/Subtotal", Subtotal)
            // var subtotalprice = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Subtotal");
            // var Shipping = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Shipping");
            // var tax = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/tax");

            // var taxPrice = (subtotalprice * tax) / 100;
            // this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/taxPrice", taxPrice)
            // var GrandTotal = subtotalprice + taxPrice + Shipping;
            // this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/GrandTotal", GrandTotal);
            // this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);
            // this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);



            var zModel = this.getView().getModel("cartData").getData().cartdata;

            if (zModel.length === 0) {
                debugger;
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/Subtotal", 0)
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/Shipping", 50)
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/taxPrice", 0)
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/tax", 5)
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/GrandTotal", 0)
                this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);
            } else {
                var Subtotal = 0;
                for (var j = 0; j < zModel.length; j++) {
                    debugger;
                    Subtotal += zModel[j].finalPrice;
                }
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/Subtotal", Subtotal)
                var subtotalprice = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Subtotal");
                var Shipping = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Shipping");
                var tax = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/tax");

                var taxPrice = (subtotalprice * tax) / 100;
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/taxPrice", taxPrice)
                var GrandTotal = subtotalprice + taxPrice + Shipping;
                this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/GrandTotal", GrandTotal);
                this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);
                this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);
            }

        },

        onpressproductgocart: function (oEvent) {
            debugger
            var oData = this.getOwnerComponent().getModel("itemsData").getData();
            var price = this.getOwnerComponent().getModel("itemsData").getProperty("/price");
            var offer = this.getOwnerComponent().getModel("itemsData").getProperty("/offer");
            var sproductId = this.getOwnerComponent().getModel("itemsData").getProperty("/productId");
            var parprice = parseInt(offer);
            var quantity = 1;
            var finalPrice = price * quantity;
            if (parprice) {
                finalPrice = finalPrice - (finalPrice * (parprice / 100));
            }
            oData.finalPrice = finalPrice;
            this.getOwnerComponent().getModel("cartData").getData().cartdata.push(oData);
            this.getOwnerComponent().getModel("cartData").refresh(true);
            var datalength = this.getOwnerComponent().getModel("cartData").getData().cartdata.length
            this.getView().byId("badge").setValue(datalength);


            var oModel = this.getOwnerComponent().getModel("category").getData();
            for (var t = 0; t < oModel.Categories.length; t++) {
                for (var j = 0; j < oModel.Categories[t].products.length; j++) {
                    if (oModel.Categories[t].products[j].productId === sproductId) {
                        this.getOwnerComponent().getModel("category").setProperty("/Categories/" + t + "/products/" + j + "/visiblestepInput", true);
                        this.getOwnerComponent().getModel("category").setProperty("/Categories/" + t + "/products/" + j + "/visible", false);
                        this.getOwnerComponent().getModel("category").setProperty("/Categories/" + t + "/products/" + j + "/quantity", 1);
                        this.getOwnerComponent().getModel("category").refresh(true);
                        this.getOwnerComponent().getModel("cartData").refresh(true);
                        this.getOwnerComponent().getModel("itemsData").refresh(true);
                        this.getOwnerComponent().getModel("BestSeller").refresh(true);
                        break;
                    }
                }
            }

            this.getOwnerComponent().getModel("itemsData").setProperty("/visible", false);
            this.getOwnerComponent().getModel("itemsData").setProperty("/visiblestepInput", true);
            this.getOwnerComponent().getModel("itemsData").refresh(true);


            var zModel = this.getView().getModel("cartData").getData().cartdata;

            if (zModel === "") {
                debugger;
            } else {
                var Subtotal = 0;
                for (var x = 0; x < zModel.length; x++) {
                    debugger;
                    Subtotal += zModel[x].finalPrice;
                }
                // console.log("Total Final Price:");
            }
            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/Subtotal", Subtotal)
            var subtotalprice = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Subtotal");
            var Shipping = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Shipping");
            var tax = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/tax");

            var taxPrice = (subtotalprice * tax) / 100;
            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/taxPrice", taxPrice)
            var GrandTotal = subtotalprice + taxPrice + Shipping;
            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/GrandTotal", GrandTotal);
            this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);
            this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);
        },
        onSearchProduct: function (oEvent) {
            debugger
            var sQuery = oEvent.getParameter("query");
            var oBinding = this.getView().byId("ShortProductList").getBinding("items");
            var aFilters = [];

            if (sQuery) {

                var oFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sQuery);
                aFilters.push(oFilter);
            }
            if (aFilters.length > 0) {
                oBinding.filter(aFilters, true);
            } else {
                oBinding.filter([]);
            }
        },


        onpresimageforproduct: function (oEvent) {
            debugger
            var data = oEvent.getParameter("eventSource").getProperty("src")
            var oModel = this.getOwnerComponent().getModel("itemsData")
            oModel.setProperty("/Carouselimage", data);
            oModel.refresh(true);
            //   oModel.setProperty("/image/0/image", data);

        },
        onViewProductDetailPress: function (oEvent) {
            debugger
            var sData = oEvent.getSource().getBindingContext("BestSeller").getObject();
            this.getOwnerComponent().getModel("itemsData").setData(sData);
        this.byId("navContainerMid").to(this.getView().byId("PageMid2"));
            this.onItemPress(null,sData.productId);

        },


        onProceedToCheckout: function (oEvent) {
            debugger
            var oModel = this.getOwnerComponent().getModel("cartData").getData().cartdata
           // this.getOwnerComponent().getModel("cartDataList").setData("")
            this.getOwnerComponent().getModel("cartDataList").setData(oModel);
            this.getOwnerComponent().getModel("cartDataList").refresh(true)
            var data = this.getOwnerComponent().getModel("cartDataList").getData();
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView2")
            // var mainFilter = new sap.ui.model.Filter({
            //     filters: [new sap.ui.model.Filter('Budat', sap.ui.model.FilterOperator.bt, startDate, endDate)]
            // })

        },

        onBuyNowPress: function (oEvent) {
            debugger
            var oMoedel = this.getOwnerComponent().getModel("itemsData").getData();
            //   this.getOwnerComponent().getModel("cartDataList").setData(oMoedel);
            var sfinalPrice = this.getOwnerComponent().getModel("itemsData").getData().price;
            //  this.getOwnerComponent().getModel("cartDataList").setData("")
            this.getOwnerComponent().getModel("cartDataList").setData({"cartDataList":oMoedel})
            this.getOwnerComponent().getModel("cartDataList").refresh(true);
            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/Subtotal", sfinalPrice);
            this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);
            var subtotalprice = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Subtotal");
            var Shipping = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/Shipping");
            var tax = this.getOwnerComponent().getModel("SummaryOfShopping").getProperty("/tax");
            var taxPrice = (subtotalprice * tax) / 100;
            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/taxPrice", taxPrice)
            var GrandTotal = subtotalprice + taxPrice + Shipping;
            this.getOwnerComponent().getModel("SummaryOfShopping").setProperty("/GrandTotal", GrandTotal);
            this.getOwnerComponent().getModel("SummaryOfShopping").refresh(true);
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView2");
        }





    });
});