import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { SharedRoutingModule } from "./shared-routing.module";
import { ProfileComponent } from "./profile.component";
import { ContactComponent } from "./contact.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [ProfileComponent, ContactComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SharedRoutingModule,
  ],
})
export class SharedModule {}
