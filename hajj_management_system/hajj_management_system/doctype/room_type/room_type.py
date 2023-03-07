# Copyright (c) 2022, omar@havalx.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class RoomType(Document):
	def after_insert(self):
		
		# create a new Item with Room type info
		doc = frappe.new_doc('Item')
		doc.item_code = self.name
		doc.item_name = self.type_name
		doc.item_group = "سكن"
		doc.hotel_name = self.hotel
		doc.has_serial_no = True
		doc.serial_no_series = self.type_name+".####"
		doc.description = self.hotel_name
		doc.insert()

		# set the Item Ref field in Room type with created Item in above step
		self.item = doc.name
		self.save()

		# Show alert about create Item
		frappe.msgprint(
			"Item is Created Successfully",
			alert=True,
			indicator="green"
		)
