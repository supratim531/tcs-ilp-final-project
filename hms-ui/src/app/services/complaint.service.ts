import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Complaint, ComplaintDTO } from "../models/complaint.model";
import { BackendUtilService } from "./backend-util.service";

@Injectable({
  providedIn: "root",
})
export class ComplaintService {
  private apiUrl = `${BackendUtilService.baseUrl}/complaints`;

  constructor(private http: HttpClient) {}

  createComplaint(complaint: ComplaintDTO): Observable<Complaint> {
    return this.http.post<Complaint>(this.apiUrl, complaint);
  }

  getComplaintsByUserId(userId: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(
      `${this.apiUrl}?userId=${userId}`
    );
  }

  getComplaintsByUser(customerName: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(
      `${this.apiUrl}?customerName=${customerName}`
    );
  }

  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl);
  }

  getComplaintById(id: string): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.apiUrl}/${id}`);
  }

  updateComplaint(
    id: string,
    complaint: ComplaintDTO
  ): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.apiUrl}/${id}`, complaint);
  }

  updateComplaintStatus(
    id: string,
    status: string,
    response?: string
  ): Observable<Complaint> {
    return this.http.patch<Complaint>(`${this.apiUrl}/${id}/status`, {
      status,
      response,
    });
  }

  assignComplaint(id: string, staffId: string): Observable<Complaint> {
    return this.http.patch<Complaint>(`${this.apiUrl}/${id}/assign`, {
      assignedStaffId: staffId,
    });
  }

  searchComplaints(filters: any): Observable<Complaint[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get<Complaint[]>(`${this.apiUrl}/search`, { params });
  }

  getComplaintsByStaff(staffId: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/staff/${staffId}`);
  }
}
