# Copyright (c) 2023, omar@havalx.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Program(Document):
	
	# set Item price (selling and Buying) for Program Items
	def on_submit(self):
		for item in self.program_items:
			doc = frappe.new_doc("Item Price")
			doc.item_code = item.item
			doc.price_list = 'البيع القياسية'
			doc.price_list_rate = item.selling_price
			doc.insert()
