import { Component, inject, OnInit } from '@angular/core';
import { Cottage } from '../models/cottage';
import { CottageService } from '../services/cottage.service';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { Router } from '@angular/router';
import { Note } from '../models/note';

@Component({
  selector: 'app-admin-cottages',
  standalone: true,
  imports: [AdminMenuComponent],
  templateUrl: './admin-cottages.component.html',
  styleUrl: './admin-cottages.component.css'
})
export class AdminCottagesComponent implements OnInit {
  ngOnInit(): void {
    this.cs.getAllCottages().subscribe(data=>{
      this.allCottages = data

      // this.allCottages.forEach(elm=>{
      //   if(elm.blokiranaDo!=""){
      //     this.cs.setUnblockedUntil(elm.id).subscribe(data=>{})
      //   }
      // })
    })

    this.cs.automaticUnblockCottages().subscribe(data=>{
      // alert(data.message)
    })


  }

  private cs = inject(CottageService)
  private router = inject(Router)

  allCottages: Cottage[] = []

  logout(){
    localStorage.removeItem("logged")
    this.router.navigate(['../login/admin'])
  }


  getThreeMostRecent(data: Note[]) {
    return data
      .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
      .slice(0, 3);
  }


  check_reviews(c: Cottage) {
    let arr = this.getThreeMostRecent(c.lista_ocena)
    let cnt = 0
    for(let elm of arr){
      if(elm.ocena<=2) cnt+=1
    }
    return cnt==3
  }

  block(c: Cottage) {
    let until = new Date() //2025-10-17T18:41:15.741Z
    // alert(until.to)
    until.setDate(until.getDate()+2)
    // alert(until.toISOString())
    // alert(until.toLocaleTimeString())
    this.cs.setBlockedUntil(c.id, until.toISOString()).subscribe(data=>{
      alert(data.message)
    })

    window.location.reload()
  }

  unblock(c: Cottage){
    this.cs.setUnblockedUntil(c.id).subscribe(data=>{
      alert(data.message)
    })

    window.location.reload()
  }
}
