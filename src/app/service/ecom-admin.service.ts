import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EcomAdminService {
  constructor(private http: HttpClient) {}

  /**
   * Calls the web API and returns the response as text.
   * @param url The API endpoint to call
   */
  getTextFromApi(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }

  /**
   * Calls the web API and returns the response as text.
   */
  getText(): Observable<string> {
    const url = 'https://localhost:7179/api/Home/text';
    return this.http.get(url, { responseType: 'text' });
  }
}
