import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.css'
})
export class AdminMenuComponent {

  private router=inject(Router)

  home(){
    this.router.navigate(['admin'])
  }

  updDel(){
    this.router.navigate(['../admin/update_deleteUser'])
  }

  add(){
    this.router.navigate(['../admin/addUser'])
  }

  reqs(){
    this.router.navigate(['../admin/accept_denyUser'])
  }

  cotts() {
    this.router.navigate(['../admin/admin_cottages'])
  }
}
