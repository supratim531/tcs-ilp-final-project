import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { RoomDetailsComponent } from "./components/home/room-details.component";
import { UnauthGuard } from "./guards/unauth.guard";
import { CustomerGuard } from "./guards/customer.guard";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  {
    path: "home",
    loadChildren: () =>
      import("./components/home/home.module").then((m) => m.HomeModule),
    canActivate: [CustomerGuard],
  },
  {
    path: "rooms/:id",
    component: RoomDetailsComponent,
    canActivate: [CustomerGuard],
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./components/auth/auth.module").then((m) => m.AuthModule),
    canActivate: [UnauthGuard],
  },
  {
    path: "user",
    loadChildren: () =>
      import("./components/customer/customer.module").then(
        (m) => m.CustomerModule
      ),
    canActivate: [AuthGuard],
    data: { role: "CUSTOMER" },
  },

  {
    path: "profile",
    loadComponent: () =>
      import("./components/shared/profile.component").then(
        (m) => m.ProfileComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./components/admin/admin.module").then((m) => m.AdminModule),
    canActivate: [AuthGuard],
    data: { role: "ADMIN" },
  },
  {
    path: "contact",
    loadComponent: () =>
      import("./components/shared/contact.component").then(
        (m) => m.ContactComponent
      ),
    canActivate: [AuthGuard],
  },
  { path: "unauthorized", redirectTo: "/not-found" },
  {
    path: "not-found",
    component: NotFoundComponent,
  },
  { path: "**", redirectTo: "/not-found" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
