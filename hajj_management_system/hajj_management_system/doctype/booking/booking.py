# Copyright (c) 2022, omar@havalx.com and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
import frappe
from frappe import utils
class Booking(Document):

	def on_submit(self):
		doc = frappe.get_doc("Program", self.program)
		# validate if booking guest is greater than max limit
		print("Hiiiiiiiiiiiiiiiiiiiiii")
		if doc.booking_per_guest >= doc.max_limit_guests:
			frappe.throw("Please Can't booking for this program because the Max Limit is Full")
		guest_count = str(len(self.program_per_guest))
		doc.booking_per_guest = guest_count
		doc.save()

		# create Sales Invoice on Submit
		ticket_count = str(len(self.program_per_guest))
		ticket = frappe.get_doc("Route of flight Airline", self.route_of_flight)
		doc = frappe.new_doc("Sales Invoice")
		doc.customer = self.supervisor
		doc.selling_price_list = 'البيع القياسية'
		# insert rooms
		for item in self.program_per_guest:
			doc.append("items", {
				"item_code": item.room_type,
				"item_name": item.room_type_name,
				'qty': 1,
				'serial_no': item.test
			})
		
		for item in self.program_per_guest:
			if item.visa:
				doc.append("items", {
					"item_code": item.visa,
					"item_name": item.visa,
					'qty': 1
				})
		if self.additional_item_per_guest:
			for item in self.additional_item_per_guest:
				doc.append("items", {
					"item_code": item.item,
					"item_name": item.item,
					'qty': 1
				})
		# insert ticket
		doc.append("items", {
			"item_code": ticket.item_reference,
			'qty': ticket_count
		})
		doc.update_stock = True
		hotel = frappe.get_doc("Hotel", self.hotel)
		doc.set_warehouse = hotel.warehouse_ref
		doc.insert()
		self.invoice_ref = doc.name
		self.save()
		frappe.msgprint("Sales Invoice is Created Successfully")


	# Throw validation on check out date
	# def before_save(self):
	# 	if(self.check_out < self.check_in):
	# 		frappe.throw("Please: Select valid Check Out Date :)")

	# change the status of booking (Check In)
	@frappe.whitelist()
	def start_check_in(self):
		for room in self.booked_room:
			doc = frappe.get_doc('Room', room.room_number)
			doc.status = 'Occupied'
			doc.save()
		self.status = "Check-In"
		self.save()

	# will be delete it
	@frappe.whitelist()
	def start_check_out(self):
		for room in self.booked_room:
			doc = frappe.get_doc('Room', room.room_number)
			doc.status = 'Free'
			doc.save()
		self.status = "Check-Out"
		self.exact_check_out = utils.today()
		self.save()

	@frappe.whitelist()
	def set_invoice_ref(self, invoice_ref):
		self.invoice_ref = invoice_ref
		self.save()	

	@frappe.whitelist()
	def create_so(self):
		pass

	@frappe.whitelist()
	def validate_set_ticket(self):
		pass