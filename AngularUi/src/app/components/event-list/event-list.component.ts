import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {
  events: any[] = [];

  selectedEventId: number | null = null;
  attendees: any[] = [];

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe((data: Event[]) => {
      this.events = data;
    });
  }

  // Navigate to the event details page
  viewEvent(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  // Navigate to the event edit page
  editEvent(eventId: number): void {
    this.router.navigate(['/events/edit', eventId]);
  }

  // Delete the event
  deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe(() => {
        this.loadEvents();  // Reload the event list after deletion
      });
    }
  }

  // Get event status (Upcoming or Completed)
  getEventStatus(eventDate: string): string {
    const today = new Date();
    const eventDateParsed = new Date(eventDate);
    return eventDateParsed < today ? 'Completed' : 'Upcoming';
  }

  // Return a class based on the event status
  getEventStatusClass(eventDate: string): string {
    const today = new Date();
    const eventDateParsed = new Date(eventDate);
    return eventDateParsed < today ? 'text-success' : 'text-info';
  }

  loadAttendees(eventId: number) {
    this.eventService.getAttendees(eventId).subscribe(data => {
      this.attendees = data;
    }, error => {
      console.error('Error loading attendees:', error);
    });
  }

  // Event handler for selecting an event and loading its attendees
  selectEvent(eventId: number) {
    this.selectedEventId = eventId;
    this.loadAttendees(eventId);
  }
}
