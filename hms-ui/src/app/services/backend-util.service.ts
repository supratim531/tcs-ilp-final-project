import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class BackendUtilService {
  static baseUrl: string = "http://localhost:8000/api/v1";
  // static baseUrl: string = "http://10.32.44.55:8000/api/v1";

  constructor() {}

  static getBaseUrl(): string {
    return BackendUtilService.baseUrl;
  }
}
