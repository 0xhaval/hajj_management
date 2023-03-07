// Copyright (c) 2022, omar@havalx.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Booking', {

	// un set program field while booking is not depend on program
	is_umrah:function(frm){
		if(frm.doc.is_umrah == "حجز غير مبني على برنامج"){
			frm.set_value("program", "")
			frm.refresh_field("program")
		}
	},

	'check_out': function(frm) {
		let ch_in = frm.doc.check_in
		let ch_out = frm.doc.check_out
		
		// validate if Check Out less than Check In
		if(ch_in > ch_out){
		    frappe.msgprint("Please: Select valid Check Out Date :)");
		}else{
		    let diff = frappe.datetime.get_day_diff( ch_out , ch_in);
		    frm.set_value("number_of_days", diff)
		}
	},

	// Validation on Check-In date
	'check_in': function(frm) {
		let ch_in = frm.doc.check_in
		let ch_out = frm.doc.check_out
		
		// validate if Check Out less than Check In
		if(ch_in > ch_out){
		    frappe.msgprint("Please: Select valid Check Out Date :)");
		}else{
		    let diff = frappe.datetime.get_day_diff( ch_out , ch_in);
		    frm.set_value("number_of_days", diff)
		}
	},

	// Filter Booked Room child table, with Free Rooms
	setup: function(frm) {
        frm.set_query("program", function() {
    		return {
    			filters: {
					"max_limit_guests": ["!=", 0],
					"docstatus":["=", 1]
				}
    		}
    	})

        frm.set_query("route_of_flight", function() {
    		return {
    			"filters": {
					"airline": frm.doc.airline
				}
    		}
    	})
	},

	// button to fetch child table from program
    refresh: function(frm) {

        frm.set_query("flight", "program_per_guest", function() {
    		return {
    			"filters": {
					"airline_name": frm.doc.airline
				}
    		}
    	})

        frm.set_query("visa", "program_per_guest", function() {
    		return {
    			filters: {
					"item_group": ["=", "فيزا"]
				}
    		}
    	})
	

		if(frm.doc.docstatus != 1){
			frm.add_custom_button(__('Fetch Program Item'), function(){

				// delete all row before fetch anything
				var tbl = [];
				frm.set_value("program_item_booking", tbl)
				frm.refresh_field("program_item_booking")

				// fetch all rows from child table
				frappe.model.with_doc("Program", frm.doc.program, function() {
					var tabletransfer= frappe.model.get_doc("Program", frm.doc.program)
					$.each(tabletransfer.program_items, function(index, row){
						var d = frm.add_child("program_item_booking");
						d.is_mandatory = row.is_mandatory;
						d.level = row.level;
						d.item_type = row.item_type;
						d.item = row.item;
						d.selling_price = row.selling_price;
						frm.refresh_field("program_item_booking");
					});
				});
		  });
		}
		
	},

});

frappe.ui.form.on('Program Per Guest', {
	program_per_guest_add(frm, cdt, cdn){

		let row = locals[cdt][cdn]
		row.flight = frm.doc.route_of_flight
		frm.refresh()
		frm.set_query('mahrm', 'program_per_guest', function(doc, cdt, cdn) {
			var d = locals[cdt][cdn];
			return {
				"filters": {
					"gender": "ذكر"
				}
			};
		});

		frm.set_query('test', 'program_per_guest', function(doc, cdt, cdn) {
			var d = locals[cdt][cdn];
			return {
				"filters": {
					"item_name": ["=", d.room_type_name],
					"supplier_name": frm.doc.hotel_name,
					"status": "Active"
				}
			};
		});
        frm.set_query("room_type", "program_per_guest", function() {
    		return {
    			filters: {
					"hotel_name": ["=", frm.doc.hotel]
				}
    		}
    	})

        frm.set_query("room", "program_per_guest", function() {
    		return {
    			filters: {
					"item_name": ["=", row.room_type_name],
					"status": ["=", "Active"],
					"supplier_name": ["=", frm.doc.hotel_name]
				}
    		}
    	})

        frm.set_query("flight", "program_per_guest", function() {
    		return {
    			filters: {
					"airline_name": ["=", frm.doc.airline]
				}
    		}
    	})

        frm.set_query("visa", "program_per_guest", function() {
    		return {
    			filters: {
					"item_group": ["=", "فيزا"]
				}
    		}
    	})

	}

});

frappe.ui.form.on('Additional Item Per Guest', {
	additional_item_per_guest_add:function(frm, cdt, cdn){
		frm.set_query("item", "additional_item_per_guest", function(){
			return {
				filters: {
					"item_group": ["=", "خدمات أخرى"]
				}
			}
		})
	}
});
