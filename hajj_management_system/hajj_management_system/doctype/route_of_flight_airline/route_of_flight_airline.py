# Copyright (c) 2023, omar@havalx.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class RouteofflightAirline(Document):
	def after_insert(self):
		
		# create a new Item with Route of flight info
		doc = frappe.new_doc('Item')
		doc.item_code = self.name
		doc.item_name = self.from_to_from
		doc.item_group = "نقل جوي"
		doc.is_stock_item = False
		doc.airline_name = self.airline
		doc.insert()

		# set the Item Ref field in Route of flight with created Item in above step
		self.item_reference = doc.name
		self.save()

		# Show alert about create Item
		frappe.msgprint(
			"Item is Created Successfully",
			alert=True,
			indicator="green"
		)
	
	# set item name with from to from Route
	def on_update(self):
		doc = frappe.get_doc("Item", self.item_reference)
		doc.item_name = self.from_to_from
		doc.save()
