// Copyright (c) 2023, omar@havalx.com and contributors
// For license information, please see license.txt

frappe.ui.form.on('Route of flight Airline', {

	// set value for (from to from)
	after_save: function(frm) {
		let from_one, from_two, to, from_to_from = ""

		from_one = frm.doc.from_one
		from_two = frm.doc.from_two
		to = frm.doc.to
		from_to_from = from_one + " "+to+" "+from_two
		frm.set_value("from_to_from", from_to_from)
		frm.refresh()
		frm.save()

	}
	
});
