import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CustomerRoutingModule } from './customer-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SearchRoomsComponent } from './search-rooms.component';
import { BookingConfirmComponent } from './booking-confirm.component';
import { PaymentComponent } from './payment.component';
import { MyBookingsComponent } from './my-bookings.component';
import { ComplaintsComponent } from './complaints.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SearchRoomsComponent,
    BookingConfirmComponent,
    PaymentComponent,
    MyBookingsComponent,
    ComplaintsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CustomerRoutingModule
  ]
})
export class CustomerModule { }