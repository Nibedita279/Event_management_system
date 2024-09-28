import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contact = {
    name: '',
    email: '',
    message: ''
  };
support:string="hyscaler@gmail.com";

  onSubmit() {
    // Add your form submission logic here
    // For example, you can send this.contact to your backend API
    console.log('Form Submitted', this.contact);
    alert("Your Data is submitted , We will reach you soon");

    // Reset the form after submission
    this.contact = {
      name: '',
      email: '',
      message: ''
    };
  }
}
