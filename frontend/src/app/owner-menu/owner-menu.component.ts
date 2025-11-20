import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-menu',
  standalone: true,
  imports: [],
  templateUrl: './owner-menu.component.html',
  styleUrl: './owner-menu.component.css'
})
export class OwnerMenuComponent {
  private router = inject(Router)

   home(){
    localStorage.clear()
    this.router.navigate([''])
  }

  profile() {
    this.router.navigate(['owner'])
  }

  cotts(){
    this.router.navigate(['../owner/cottages'])
  }

  rsvp() {
    this.router.navigate(['../owner/reservations'])
  }

  stats() {
    this.router.navigate(['../owner/statistics'])
  }
}
