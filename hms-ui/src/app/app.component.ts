import { Component, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { Router } from "@angular/router";
import { User } from "./models/user.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  firstName: string = "";
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.firstName = this.currentUser?.fullName.split(" ")[0] || "";
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/auth/login"]);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCustomer(): boolean {
    return this.authService.isCustomer();
  }
}
