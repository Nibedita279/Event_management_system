import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent {
  editEventForm: FormGroup=new FormGroup({});
  eventId: number=0;

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['id']; // Get event ID from route
    this.loadEvent();
    this.initForm();
  }

  // Initialize the form
  initForm(): void {
    this.editEventForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      ticket_price: ['', [Validators.required, Validators.min(0)]],
      privacy: [false],
    });
  }

  // Load the event details
  loadEvent(): void {
    this.eventService.getEvent(this.eventId).subscribe((event) => {
      this.editEventForm.patchValue({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        ticket_price: event.ticket_price,
        privacy: event.privacy,
      });
    });
  }

  // Submit the updated event details
  onSubmit(): void {
    if (this.editEventForm.valid) {
      this.eventService.updateEvent(this.eventId, this.editEventForm.value).subscribe(
        (response) => {
          this.router.navigate(['/events']); // Redirect to event list after saving
        },
        (error) => {
          console.error('Error updating event:', error);
        }
      );
    }
  }
}
