import { Component, inject, OnInit } from '@angular/core';
import { OwnerMenuComponent } from '../owner-menu/owner-menu.component';
import { Reservation } from '../models/reservation';
import { CottageService } from '../services/cottage.service';
import { UserService } from '../services/user.service';
import { ReservationService } from '../services/reservation.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-owner-reservations',
  standalone: true,
  imports: [OwnerMenuComponent, FormsModule],
  templateUrl: './owner-reservations.component.html',
  styleUrl: './owner-reservations.component.css'
})
export class OwnerReservationsComponent implements OnInit{
  ngOnInit(): void {

    let o = localStorage.getItem("logged")
    if(o!=null){
        this.us.getUserByUsername(o).subscribe(data=>{
          this.owner = data

        })


      this.rs.resByOwnerSorted(o).subscribe(data=>{
        this.reservations = data
        this.reservations.forEach(elm=>{

          if(elm.status=="neobradjen"){
            this.res_neobradjen.push(elm)
          } else{
            this.res_acc_den.push(elm)
          }

          if(!(elm.turista in this.tourists)){
            this.tourists.push(elm.turista)
          }
        })

        this.tourists.forEach(yoyo=>{
          this.us.getUserByUsername(yoyo).subscribe(obj=>{
            this.t_obj.push(obj)
          })
        })
      })
    }

    this.rs.autoDenyRes_owner().subscribe(data=>{})
  }

  reservations: Reservation[]=[]
  res_neobradjen: Reservation[]=[]
  res_acc_den: Reservation[]=[]
  owner: User = new User()

  private cs = inject(CottageService)
  private us = inject(UserService)
  private rs = inject(ReservationService)
  private router = inject(Router)

  tourists: string[]=[]
  t_obj: User[]=[]

  ret_user(u:string){
    for(let t of this.t_obj){
      if(t.korisnicko_ime==u){
        return `${t.ime} ${t.prezime}`
      }
    }
    return "-"
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


  accepted = false
  step = 0
  comment = ""
  proc_res: Reservation = new Reservation()
  err = ""

  accept(r: Reservation) {
    this.step = 1
    this.accepted = true
    this.proc_res = r
  }

  deny(r: Reservation) {
    this.step = 1
    this.accepted = false
    this.proc_res = r
  }

  confirm() {
    if(this.proc_res!=null && this.accepted){
      //accept res
      this.rs.accRes(this.proc_res.id, this.comment).subscribe(data=>{
        alert(data.message)
        window.location.reload()
      })
    } else if(this.proc_res!=null && !this.accepted){
      if(this.comment==""){
        this.err="Mora se ostaviti komentar pri odbijanju!"
        return
      }

      this.err=""
      this.rs.denyRes(this.proc_res.id, this.comment).subscribe(data=>{
        alert(data.message)
        window.location.reload()
      })
    }
    this.step = 0
  }

  giveup(){
    this.step = 0
    this.comment = ""
    this.accepted = false
    this.proc_res = new Reservation()
  }

  passChange(){
    this.router.navigate(['../updatePassword'])
  }

  logout(){
    localStorage.clear()
    this.router.navigate(['login'])
  }

}
