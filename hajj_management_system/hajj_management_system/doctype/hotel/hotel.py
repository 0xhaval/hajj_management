# Copyright (c) 2023, omar@havalx.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Hotel(Document):

	def after_insert(self):
		# insert Supplier after insert Hotel
		sup = frappe.new_doc("Supplier")
		sup.supplier_name = self.hotel_name
		sup.supplier_group = "الخدمات"
		sup.hotel_ref = self.name
		sup.insert()
		
		# insert Warehouse after insert Hotel
		ds = frappe.new_doc("Warehouse")
		ds.warehouse_name = self.hotel_name
		ds.insert()

		self.supplier_ref = sup.name
		self.warehouse_ref = ds.name
		self.save()
