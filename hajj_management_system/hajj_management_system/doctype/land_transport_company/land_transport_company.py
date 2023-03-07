# Copyright (c) 2023, omar@havalx.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class LandTransportCompany(Document):
	def after_insert(self):
		# create a new Item with Route of flight info
		doc = frappe.new_doc('Item')
		doc.item_code = self.name
		doc.item_name = self.agency_name
		doc.item_group = "نقل بري"
		doc.is_stock_item = False
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
