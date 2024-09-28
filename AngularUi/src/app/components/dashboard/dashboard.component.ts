import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = []; // List of events after applying filters
  selectedFilter = 'Title'; // Default filter type
  searchQuery = ''; // Search input


  constructor(private eventService: EventService,private router: Router) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe(data => {
      this.events = data;
      this.filteredEvents = this.events;
      console.log(this.filteredEvents);

    });
    
  }
  viewEventDetails(eventId: number): void {
    this.router.navigate(['/events', eventId]);  // Navigate to event details page
  }

   // Set filter type based on user selection
   setFilter(filter: string) {
    this.selectedFilter = filter.charAt(0).toUpperCase() + filter.slice(1); // Capitalize filter
  }

  // Search function to filter events based on selected filter type and search query
  applySearch() {
    if (!this.searchQuery) {
      this.filteredEvents = this.events;
      return;
    }

    this.filteredEvents = this.events.filter(event => {
      switch (this.selectedFilter.toLowerCase()) {
        case 'title':
          return event.title?.toLowerCase().includes(this.searchQuery.toLowerCase());
        case 'location':
          return event.location?.toLowerCase().includes(this.searchQuery.toLowerCase());
        case 'date':
          return new Date(event.date).toLocaleDateString() === new Date(this.searchQuery).toLocaleDateString();
        default:
          return false;
      }
    });
  }
  // filterEvents() {
  //   console.log("All Events:", this.events);
  //   this.filteredEvents = this.events.filter(event => {
  //     const matchesTitle = event.title.toLowerCase().includes(this.filter.title.toLowerCase());
  //     const matchesLocation = event.location.toLowerCase().includes(this.filter.location.toLowerCase());
  //     const matchesKeyword = event.keywords && event.keywords.some((keyword: string) => keyword.toLowerCase().includes(this.filter.keyword.toLowerCase()));
  //     const matchesDate = this.filter.date ? new Date(event.date).toDateString() === new Date(this.filter.date).toDateString() : true;
  //     console.log("Event:", event);
  //     console.log("Matches Title:", matchesTitle);
  //     console.log("Matches Location:", matchesLocation);
  //     console.log("Matches Keyword:", matchesKeyword);
  //     console.log("Matches Date:", matchesDate);
  //     return matchesTitle && matchesLocation && matchesKeyword && matchesDate;
  //   });
  //   console.log("Filtered Events:", this.filteredEvents);
  // }

  // resetFilters() {
  //   this.filter = { title: '', location: '', date: '', keyword: '' };
  //   this.filteredEvents = [...this.events]; // Reset to show all events
  // }




  getEventStatus(eventDate: string): string {
    const today = new Date();
    const eventDateParsed = new Date(eventDate);
    return eventDateParsed < today ? 'Completed' : 'Upcoming';
  }
}