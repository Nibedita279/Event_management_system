import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';


@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent {
  eventData = {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    ticket_price: 0,
    privacy: false
  };

  constructor(private fb: FormBuilder, private eventService: EventService, private router: Router) {
    // this.eventForm = this.fb.group({
    //   title: ['', Validators.required],
    //   description: ['', Validators.required],
    //   date: ['', Validators.required],
    //   location: ['', Validators.required],
    //   ticket_price: ['', Validators.required]
    // });
  }

  onSubmit() {
    console.log('Event Created:', this.eventData);
    // Call your event service to create the event
    this.eventService.createEvent(this.eventData).subscribe(
      response => {
        console.log('Event successfully created:', response);
        this.router.navigate(['/dashboard']); // Navigate to the dashboard after creation
      },
      error => {
        console.error('Error creating event:', error);
      }
    );
  }
}
