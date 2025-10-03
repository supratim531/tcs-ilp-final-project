import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Room, SearchRoomDTO } from "../models/room.model";
import { BackendUtilService } from "./backend-util.service";

@Injectable({
  providedIn: "root",
})
export class RoomService {
  private apiUrl = `${BackendUtilService.baseUrl}/rooms`;

  constructor(private http: HttpClient) {}

  searchRooms(searchCriteria: SearchRoomDTO): Observable<Room[]> {
    let rooms = this.http.post<Room[]>(`${this.apiUrl}/search`, searchCriteria);
    return rooms;
  }

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  getRoomById(id: string): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }

  updateRoom(id: string, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, room);
  }

  deleteRoom(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchRoomsByFilters(filters: any): Observable<Room[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get<Room[]>(`${this.apiUrl}/filter`, { params });
  }

  bulkUploadRooms(file: File): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.apiUrl}/bulk-upload`, formData);
  }
}
