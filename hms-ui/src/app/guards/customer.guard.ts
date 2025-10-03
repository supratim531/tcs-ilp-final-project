import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class CustomerGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();

    if (!user) {
      return true;
    }

    if (user?.role === "ADMIN") {
      this.router.navigate(["/admin/dashboard"]);
      return false;
    }

    return true;
  }
}
