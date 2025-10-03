import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { User, UpdateUserDTO, RegisterDTO } from "../models/user.model";
import { BackendUtilService } from "./backend-util.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = `${BackendUtilService.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, user: UpdateUserDTO): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  createUser(userData: RegisterDTO): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  deactivateUser(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }

  activateUser(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/activate`, {});
  }

  resetPassword(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reset-password`, {});
  }

  searchUsers(filters: any): Observable<User[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get<User[]>(`${this.apiUrl}/search`, { params });
  }

  updateProfile(userId: string, user: UpdateUserDTO): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, user);
  }
}
