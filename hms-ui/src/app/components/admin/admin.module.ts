import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AdminRoutingModule } from "./admin-routing.module";
import { AdminDashboardComponent } from "./admin-dashboard.component";
import { RoomsComponent } from "./rooms/rooms.component";
import { AddRoomComponent } from "./add-room/add-room.component";
import { AdminComplaintsComponent } from "./complaints/admin-complaints.component";
import { UsersComponent } from "./users/users.component";
import { AdminBookingsComponent } from "./bookings/admin-bookings.component";

@NgModule({
  declarations: [
    AdminDashboardComponent,
    RoomsComponent,
    AddRoomComponent,
    AdminComplaintsComponent,
    UsersComponent,
    AdminBookingsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {}
