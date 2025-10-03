import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ComplaintsComponent } from "../customer/complaints.component";
import { AddRoomComponent } from "./add-room/add-room.component";
import { AdminDashboardComponent } from "./admin-dashboard.component";
import { RoomsComponent } from "./rooms/rooms.component";
import { AdminComplaintsComponent } from "./complaints/admin-complaints.component";
import { UsersComponent } from "./users/users.component";
import { AdminBookingsComponent } from "./bookings/admin-bookings.component";

const routes: Routes = [
  { path: "dashboard", component: AdminDashboardComponent },
  { path: "rooms", component: RoomsComponent },
  { path: "users", component: UsersComponent },
  { path: "bookings", component: AdminBookingsComponent },
  { path: "add-room", component: AddRoomComponent },
  { path: "complaints", component: AdminComplaintsComponent },
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
