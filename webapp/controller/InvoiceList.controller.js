sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"../util/themeHelper"

], (Controller, JSONModel, formatter, Filter, FilterOperator, Fragment, themeHelper) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.InvoiceList", {
		formatter: formatter,

		onInit() {
			const oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");
			const myPath = "https://services.odata.org/Northwind/Northwind.svc/Invoices/?$top=10&$format=json";
			//const myPath = "https://port8080-workspaces-ws-kwcwt.eu10.applicationstudio.cloud.sap/V2/Northwind/Northwind.svc"
			const that = this;
			
			$.ajax({
				type: "GET",
				url: myPath,
				success: function(data){
					//var oModel = new JSONModel(data);
					var oModel = new sap.ui.model.json.JSONModel(data);
					that.getView().setModel(oModel, "SearchResModel"); 		
					//sap.ui.getCore().setModel(oModel, "SearchResModel");			
				},
				error: function (errordata){
					console.log (errordata);
				}
			})
			
			/*  //TESTDATA
			var oModel2 = new JSONModel({
				name: 'test',
				object:[ 
					{ key: 'value1', value: 'test'},
					{ key: 'value2', value: 'test'},
					{ key: 'value3', value: 'test'},
					{ key: 'value3', value: 'test'}
				]
			});

			this.getView().setModel(oModel2, 'jsonModel');
			*/

		},

		onRowClick:function (oEvent) {
			let oListItem 			= oEvent.getParameter("listItem");			
			//var sPath 				= oListItem.getBindingContext().getPath();  //=> no BindingContext!?
			let oBindingContext		= oListItem.oBindingContexts;

			let selectedEntryParm 	= Object.entries(oBindingContext);
			let mySelectedModelName = selectedEntryParm[0][0];
			let mySelectedPath		= selectedEntryParm[0][1]['sPath'];

			let oPressedItem 		= this.getView().getModel(mySelectedModelName).getProperty(mySelectedPath);

			const sTheme = themeHelper.getTheme();


			alert  (JSON.stringify(oPressedItem));
		}
		,
		itemPressHandler: function(oEvent){
			alert ('Ha!');
		}
		,
		onFilterInvoices(oEvent) {
			// build filter array
			const aFilter = [];
			const sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
			}

			// filter binding
			const oList = this.byId("invoiceList");
			const oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		}
		,
		onPressOpenOverflowMenu: function (oEvent) {
			const oButton = oEvent.getSource();
			const fragName = "ui5.walkthrough.view.overflowMenu";
			
			if (!this._oOverflowMenuFragment) {
				this._oOverflowMenuFragment = Fragment.load({
					name: "ui5.walkthrough.view.overflowMenu",
					controller: this
				}).then(function (oMenu) {
					oMenu.openBy(oButton);
					this._oOverflowMenuFragment = oMenu;
					return this._oOverflowMenuFragment;
				}.bind(this));
				} else {
					this._oOverflowMenuFragment.openBy(oButton);
				}
		}
		,
		onSelectTheme: function (oEvent) {
			const oItem = oEvent.getParameter("item")
			const sKey = oItem.getKey();
			themeHelper.setTheme(sKey);
		},
		
	});
});
