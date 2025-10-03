import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import {
  ChangePasswordDTO,
  LoginDTO,
  RegisterDTO,
  User,
} from "../models/user.model";
import { BackendUtilService } from "./backend-util.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${BackendUtilService.baseUrl}/users`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.user) {
          localStorage.setItem("currentUser", JSON.stringify(response.user));
          localStorage.setItem("token", response.token ?? "token");
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  register(userData: RegisterDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    this.currentUserSubject.next(null);
  }

  checkUserExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/${username}`);
  }

  changePassword(changePasswordDTO: ChangePasswordDTO): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/change-password`,
      changePasswordDTO
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "ADMIN";
  }

  isCustomer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "CUSTOMER";
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }
}
