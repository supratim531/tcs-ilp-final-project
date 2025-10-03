import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
  imports: [CommonModule, RouterLink],
})
export class ContactComponent {
  hotelInfo = {
    name: "Grand Hotel Booking System",
    address: "123 Hotel Street, City Center, State 12345",
    phone: "+1 (555) 123-4567",
    email: "info@grandhotel.com",
    website: "www.grandhotel.com",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
  };

  supportHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 4:00 PM" },
  ];

  departments = [
    {
      name: "Reservations",
      phone: "+1 (555) 123-4567",
      email: "reservations@grandhotel.com",
      icon: "fas fa-calendar-alt",
    },
    {
      name: "Customer Support",
      phone: "+1 (555) 123-4568",
      email: "support@grandhotel.com",
      icon: "fas fa-headset",
    },
    {
      name: "Billing & Payments",
      phone: "+1 (555) 123-4569",
      email: "billing@grandhotel.com",
      icon: "fas fa-credit-card",
    },
    {
      name: "Complaints",
      phone: "+1 (555) 123-4570",
      email: "complaints@grandhotel.com",
      icon: "fas fa-exclamation-triangle",
    },
  ];
}
