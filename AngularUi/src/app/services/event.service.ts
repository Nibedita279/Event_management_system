import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://127.0.0.1:8000/api/events/';

  constructor(private http: HttpClient) { }
// Get the access token from local storage
private getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('access_token');
  return new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
}

// Fetch all events
getEvents(): Observable<any[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<any[]>(this.apiUrl, { headers });
}

// Create a new event
createEvent(eventData: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.post(this.apiUrl, eventData, { headers });
}


  getEvent(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}${id}/`,{ headers });
  }
  // Delete event by ID
  deleteEvent(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}${id}/`,{ headers });
  }
// Update event by ID
updateEvent(id: number, event: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.put<any>(`${this.apiUrl}${id}/`, event,{ headers });
}
createAttendee(eventId: number, attendee: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.post<any>(`${this.apiUrl}${eventId}/attendees/`, attendee,{ headers });
}
getAttendees(eventId: number): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get(`${this.apiUrl}${eventId}/attendees/`,{ headers });
}
}
