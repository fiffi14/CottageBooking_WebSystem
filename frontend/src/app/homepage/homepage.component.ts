import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../models/user';
import { Cottage } from '../models/cottage';
import { UserService } from '../services/user.service';
import { CottageService } from '../services/cottage.service';
import { Reservation } from '../models/reservation';
import { ReservationService } from '../services/reservation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit{
  ngOnInit(): void {
    this.us.getAllOwners().subscribe(data=>{
      data.forEach(elm => {
        if(elm.status=='aktiviran'){
          this.allOwners.push(elm)
        }
      })
    })

    this.us.getAllTourists().subscribe(data=>{
      data.forEach(elm => {
        if(elm.status=='aktiviran'){
          this.allTourists.push(elm)
        }
      })
    })

    this.cs.getAllCottages().subscribe(data=>{
      this.allCottages=data
      this.srchCottages=data
    })

    this.rs.getReservations().subscribe(data=>{
      this.allReservations = data
    })

    // alert(console.log(Number(new Date("2025-10-11").getTime())))
  }

  //1760635592258

  private us = inject(UserService)
  private cs = inject(CottageService)
  private rs = inject(ReservationService)

  allOwners: User[]=[]
  allTourists: User[]=[]
  allCottages: Cottage[]=[]
  srchCottages: Cottage[]=[]
  allReservations: Reservation[]= []

  last24h(){
    let cnt = 0
    const now = new Date()
    const day_ms = 24*60*60*1000

    this.allReservations.forEach(elm =>{
      const given = new Date(elm.timestamp)
      const diff = now.getTime() - given.getTime()

      if(diff>=0 && diff<=day_ms && elm.status!="odbijena" && elm.status!="neobradjen") cnt+=1
    })
    return cnt
  }

  last7days(){
    let cnt = 0
    const now = new Date()
    const seven_days_ms = 7*24*60*60*1000

    this.allReservations.forEach(elm =>{

      const given = new Date(elm.timestamp)
      const diff = now.getTime() - given.getTime()

      // Date.parse
      if(diff>=0 && diff<=seven_days_ms && elm.status!="odbijena" && elm.status!="neobradjen") cnt+=1
    })
    return cnt
  }

  last30days(){
    let cnt = 0
    const now = new Date()
    const thirty_days_ms = 30*24*60*60*1000

    this.allReservations.forEach(elm =>{
      const given = new Date(elm.timestamp)
      const diff = now.getTime() - given.getTime()

      if(diff>=0 && diff<=thirty_days_ms && elm.status!="odbijena" && elm.status!="neobradjen") cnt+=1
    })
    return cnt
  }


  parm_name = ""
  parm_place = ""


  search(){
    if(this.parm_name=="" && this.parm_place==""){
      this.cs.getAllCottages().subscribe(data=>{
        this.srchCottages = data
      })
    } else if(this.parm_name!="" && this.parm_place==""){
      this.cs.searchByName(this.parm_name).subscribe(data=>{
        this.srchCottages = data
      })
    } else if(this.parm_name=="" && this.parm_place!=""){
      this.cs.searchByPlace(this.parm_place).subscribe(data=>{
        this.srchCottages = data
      })
    } else if(this.parm_name!="" && this.parm_place!=""){
      this.cs.searchByNamePlace(this.parm_name,this.parm_place).subscribe(data=>{
        this.srchCottages = data
      })
    }
  }

  sort_parm = "low_high"
  sort_category = "name"

  name_low_high() {
    this.srchCottages.sort((a,b)=>{
      return a.naziv.localeCompare(b.naziv)
    })
  }

  name_high_low() {
    this.srchCottages.sort((a,b)=>{
      return b.naziv.localeCompare(a.naziv)
    })
  }

  place_low_high() {
    this.srchCottages.sort((a,b)=>{
      return a.mesto.localeCompare(b.mesto)
    })
  }

  place_high_low() {
    this.srchCottages.sort((a,b)=>{
      return b.mesto.localeCompare(a.mesto)
    })
  }

  persons_low_high() {
    this.srchCottages.sort((a,b)=>{
      return a.broj_osoba-b.broj_osoba
    })
  }

  persons_high_low() {
    this.srchCottages.sort((a,b)=>{
      return b.broj_osoba-a.broj_osoba
    })
  }

  squares_low_high() {
    this.srchCottages.sort((a,b)=>{
      return a.kvadratura-b.kvadratura
    })
  }

  squares_high_low() {
    this.srchCottages.sort((a,b)=>{
      return b.kvadratura-a.kvadratura
    })
  }

  sort_cottages(){
    switch(this.sort_parm){
      case "low_high":
        switch(this.sort_category){
          case "name":
            this.name_low_high();
            break
          case "place":
            this.place_low_high();
            break
          case "persons":
            this.persons_low_high();
            break
          case "squares":
            this.squares_low_high();
            break
        }
        break

      case "high_low":
        switch(this.sort_category){
          case "name":
            this.name_high_low();
            break
          case "place":
            this.place_high_low();
            break
          case "persons":
            this.persons_high_low();
            break
          case "squares":
            this.squares_high_low();
            break
        }
        break


    }
  }

  reset_cottages(){
    this.cs.getAllCottages().subscribe(data=>{
      this.srchCottages = data
    })
  }

  private router = inject(Router)

  login(){
    this.router.navigate(['login'])
  }

  register(){
    this.router.navigate(['registration'])
  }

}
