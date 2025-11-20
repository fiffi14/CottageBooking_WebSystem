import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tourist-menu',
  standalone: true,
  imports: [],
  templateUrl: './tourist-menu.component.html',
  styleUrl: './tourist-menu.component.css'
})
export class TouristMenuComponent {

  private router = inject(Router)


  home(){
    localStorage.clear()
    this.router.navigate([''])
  }

  profile(){
    this.router.navigate(['tourist'])
  }

  cotts() {
    this.router.navigate(['../tourist/cottages'])
  }

  rsvp(){
    this.router.navigate(['../tourist/reservations'])
  }
}
