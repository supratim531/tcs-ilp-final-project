import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProfileComponent } from "./profile.component";
import { ContactComponent } from "./contact.component";

const routes: Routes = [
  { path: "profile", component: ProfileComponent },
  { path: "contact", component: ContactComponent },
  { path: "", redirectTo: "profile", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
