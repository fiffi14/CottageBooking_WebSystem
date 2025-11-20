import { Component, inject, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-acc-deny-user',
  standalone: true,
  imports: [AdminMenuComponent],
  templateUrl: './admin-acc-deny-user.component.html',
  styleUrl: './admin-acc-deny-user.component.css'
})
export class AdminAccDenyUserComponent implements OnInit {
  ngOnInit(): void {
    this.us.getAllOwners().subscribe(data=>{
      data.forEach(e =>{
        if(e.status=="neregistrovan"){
          this.allOwners.push(e)
        }
      })
    })

    this.us.getAllTourists().subscribe(data=>{
      data.forEach(e =>{
        if(e.status=="neregistrovan"){
          this.allTourists.push(e)
        }
      })
    })
  }

  private us = inject(UserService)
  allOwners: User[] = []
  allTourists: User[]= []
  private router = inject(Router)
  msg = ""

  logout() {
    localStorage.removeItem("logged")
    this.router.navigate(['../login/admin'])
  }

  accept(k: string){
    this.us.acceptUser(k).subscribe(data=>{
      // this.msg = data.message
      alert(data.message)
    })
    window.location.reload()
  }

  deny(k: string) {
    this.us.denyUser(k).subscribe(data=>{
      // this.msg=
      alert(data.message)
    })
    window.location.reload()
  }
}
