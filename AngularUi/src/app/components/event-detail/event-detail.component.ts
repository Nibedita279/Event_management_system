import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent {
  event: any | undefined;
  selectedEventId: number|null=null;
  attendeeData = {
    ticket_type: ''
  };
  constructor(private route: ActivatedRoute, private eventService: EventService) {
    
  }

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvent(eventId);
  }

  loadEvent(id: number): void {
    this.eventService.getEvent(id).subscribe((data: Event) => {
      this.event = data;
    });
  }
  

  // Get event status based on the date
  getEventStatus(eventDate: string | undefined): string {
    if (!eventDate) return '';
    const today = new Date();
    const eventDateParsed = new Date(eventDate);
    return eventDateParsed < today ? 'Completed' : 'Upcoming';
  }
  buyTicket(eventId: number): void {
    // Redirect to the payment gateway URL (Replace with your gateway URL)
    const paymentUrl = `https://your-payment-gateway.com/pay?eventId=${eventId}`;
    window.location.href = paymentUrl;
  }
  createAttendee() {
    // if (this.selectedEventId) {
    //   this.eventService.createAttendee(this.selectedEventId, this.attendeeData).subscribe(response => {
    //     console.log('Attendee created successfully', response);
    //   }, error => {
    //     console.error('Error creating attendee', error);
    //   });
    // }
    alert("ticket is booked successfully")
    this.selectedEventId = null;
  }

  selectEvent(eventId: number) {
    this.selectedEventId = eventId;
  }
}
