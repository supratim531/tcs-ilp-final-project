import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { SearchRoomsComponent } from "./search-rooms.component";
import { BookingConfirmComponent } from "./booking-confirm.component";
import { PaymentComponent } from "./payment.component";
import { MyBookingsComponent } from "./my-bookings.component";
import { ComplaintsComponent } from "./complaints.component";

const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "search-rooms", component: SearchRoomsComponent },
  { path: "booking/confirm", component: BookingConfirmComponent },
  { path: "payment", component: PaymentComponent },
  { path: "my-bookings", component: MyBookingsComponent },
  { path: "complaints", component: ComplaintsComponent },
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
