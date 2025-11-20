import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
// import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RouterLink, AdminMenuComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit{
  ngOnInit(): void {
    // alert("dodaj azuriranje podataka i ovde")
    let s = localStorage.getItem("logged")
    if(s!=null){
      this.admin = s
    }

    this.us.getAllOwners().subscribe(data=>{
      this.allOwners = data
    })

    this.us.getAllTourists().subscribe(data=>{
      this.allTourists = data
    })
  }

  allOwners: User[]= []
  allTourists: User[] = []
  admin: string = ""
  private us = inject(UserService)
  private router = inject(Router)

  home(){
    localStorage.removeItem("logged")
    this.router.navigate([''])
  }

  changePass(){
    if(localStorage.getItem("logged")==null){
      localStorage.setItem("logged", this.admin)
    }
    this.router.navigate(['../updatePassword'])
  }

  logout(){
    localStorage.removeItem("logged")
    this.router.navigate(['../login/admin'])
  }
}
