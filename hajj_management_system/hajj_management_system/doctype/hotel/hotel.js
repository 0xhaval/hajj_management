// Copyright (c) 2023, omar@havalx.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Hotel', {
	// refresh: function(frm) {

	// }
});
frappe.ui.form.on('Hotel Room Type and Room', {
	hotel_room_type_and_room_add:function(frm, cdt, cdn){
		frm.set_query('room_type', 'hotel_room_type_and_room', function(doc, cdt, cdn) {
			return {
				"filters": {
					"hotel": ["=", frm.doc.name]
				}
			};
		});
	}
});
