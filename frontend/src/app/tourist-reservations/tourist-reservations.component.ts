import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TouristMenuComponent } from '../tourist-menu/tourist-menu.component';
import { Router } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { UserService } from '../services/user.service';
import { Reservation } from '../models/reservation';
import { User } from '../models/user';
import { Cottage } from '../models/cottage';
import { CottageService } from '../services/cottage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tourist-reservations',
  standalone: true,
  imports: [TouristMenuComponent, CommonModule, FormsModule],
  templateUrl: './tourist-reservations.component.html',
  styleUrl: './tourist-reservations.component.css'
})
export class TouristReservationsComponent implements OnInit{

  ngOnInit(): void {
    let u = localStorage.getItem("logged")
    if(u!=null){
      this.us.getUserByUsername(u).subscribe(data=>{
        this.tourist = data
      })

      this.rs.getResByTourist(u).subscribe(rsvp=>{
        this.allRsvp = rsvp
        // alert(rsvp==null)
        for (let i = 0; i < rsvp.length; i++) {
          if(new Date(rsvp[i].datum_do)>=this.today && rsvp[i].status!="odbijena"){
            this.currRsvp.push(rsvp[i])
          } else{
            this.passedRsvp.push(rsvp[i])
          }

        }

        // for (let i = 0; i < this.allRsvp.length; i++) {
        //   this.cs.getById(rsvp[i].idVikendice).subscribe(cott=>{
        //     rsvp[i].cottName = cott.naziv
        //     rsvp[i].cottPlace = cott.mesto
        //   })
        // }



        this.passedRsvp.sort((a, b) => {
          return new Date(b.datum_od).getTime() - new Date(a.datum_od).getTime();
        });
      })


    }


  }


  private router = inject(Router)
  private rs = inject(ReservationService)
  private us = inject(UserService)
  private cs = inject(CottageService)

  allRsvp: Reservation[]=[]
  currRsvp: Reservation[]=[]
  currCotts: string[]=[]
  passedRsvp: Reservation[]=[]
  passCotts: string[]=[]
  today = new Date()
  tourist: User = new User()

  sorted(){
    this.passedRsvp.sort((a, b) => {
          return new Date(b.datum_do).getTime() - new Date(a.datum_do).getTime();
    });
  }

  passChange(){
    this.router.navigate(['../updatePassword'])
  }

  logout(){
    localStorage.clear()
    this.router.navigate(['login'])
  }

  formatDate(isoString: string): string {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${day}.${month}.${year}. ${hours}:${minutes}`;
  }


  isWithinPast24Hours(isoString: string): boolean {
    const givenDate = new Date(isoString).getTime()
    const now = new Date().getTime()

    const diff = givenDate - now
    return (diff >= 0 && diff < 24 * 60 * 60 * 1000 ) || (new Date()>=new Date(isoString))// ako je datum prosao bice ispod
  }

  cancel(r: Reservation){
    this.rs.cancelRes(r.turista, r.timestamp).subscribe(data=>{
      alert(data.message)
    })
    window.location.reload()
  }


  reviewing = false
  comment = ""
  rating: number = 2.5

  updateSlider(value: number) {
    const slider = document.querySelector<HTMLInputElement>('.slider');
    if (!slider) return;

    const percent = ((value - +slider.min) / (+slider.max - +slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, gold 0%, gold ${percent}%, #ddd ${percent}%, #ddd 100%)`;
  }


  review(r: Reservation) {
    this.reviewing=true
    // alert(r.cottName)
    localStorage.setItem("review", JSON.stringify(r))
  }

  giveup(){
    // this.reviewing=false
    // this.comment = ""
    // this.rating = 2.5

    localStorage.removeItem("review")
    window.location.reload()
  }

  err=""

  addCommentGrade(){
    if(this.comment.trim()==""){
      this.err="Niste nikakav komentar uneli!"
      return
    }

    this.err=""

    let r = localStorage.getItem("review")
    if(r!=null){
      let res = JSON.parse(r!)
      // alert(res.cottName)
      this.rs.review(res.turista, res.timestamp, this.comment, this.rating).subscribe(data=>{
        if(data.message.startsWith("Neuspešn") || data.message.startsWith("Greška")) alert(data.message)
      })

      this.cs.add_review(res.vlasnik, res.cottName, res.cottPlace, this.rating, this.comment, res.turista).subscribe(data=>{
        if(data.message.startsWith("Neuspešn") || data.message.startsWith("Greška")) alert(data.message)
      })
      alert("Uspešno dodeljivanje recenzije!")
      window.location.reload()

    } else{
      this.err="Došlo je do greške, osvežite stranicu i probajte ponovo!"
      return
    }


  }

  hasResPassed(r: Reservation){
    return new Date() >= new Date(r.datum_do)
  }

  // postavi rezervacije na blokirane uz komentar ako je datum_od i vreme proslo

  // check_ifPassed(){

  // }
}
