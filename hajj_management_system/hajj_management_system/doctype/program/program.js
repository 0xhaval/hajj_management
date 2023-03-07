// Copyright (c) 2023, omar@havalx.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Program', {

	// filter Item filed in child table depend on Hotel and Airline fields
	refresh:function(frm) {
    	frm.set_query('item', 'program_items', function(doc, cdt, cdn) {
            var d = locals[cdt][cdn];
			if(d.item_type == "سكن"){
				return {
					"filters": {
						"item_group": d.item_type,
						"hotel_name": frm.doc.hotel 
					}
				};
			}
			if(d.item_type == "نقل جوي"){
				return {
					"filters": {
						"item_group": d.item_type,
						"airline_name": frm.doc.airline 
					}
				};
			}
			else{
				return {
					"filters": {
						"item_group": d.item_type
					}
				};
			}
        });

        frm.set_query("route_of_flight", function() {
    		return {
    			filters: {
					"airline": ["=", frm.doc.airline]
				}
    		}
    	});

        frm.set_query("account", function() {
    		return {
    			filters: {
					"is_group": ["=", false]
				}
    		}
    	});
	},

	// calculate and set (Cost, Selling) amount from Program Items (Mandatory)
	before_save:function(frm){
		let items = frm.doc.program_items;
		let selling_price = 0;
		let cost_price = 0;
		for(var i=0; i<items.length; i++){
			if(items[i].is_mandatory == true){
				selling_price += items[i].selling_price;
				cost_price += items[i].cost;
			}
		}
		frm.set_value("amount", selling_price);
		frm.set_value("cost_amount", cost_price);
		frm.refresh();
	}
});

frappe.ui.form.on('Program Items', {
	'cost':function(frm,cdt,cdn){
		let row = locals[cdt][cdn]
		let cost = row.cost
		let selling_price = row.selling_price
		let pm = (((selling_price - cost) / selling_price) * 100)
		row.profit_margin = pm
		frm.refresh()
	},

	'selling_price':function(frm,cdt,cdn){
		let row = locals[cdt][cdn]
		let cost = row.cost
		let selling_price = row.selling_price
		let pm = (((selling_price - cost) / selling_price) * 100)
		row.profit_margin = pm
		frm.refresh()
	}
});