import { Component, inject, Input, OnInit } from '@angular/core';
import { TouristMenuComponent } from '../tourist-menu/tourist-menu.component';
import { Cottage } from '../models/cottage';
import { Router, RouterLink } from '@angular/router';
import { CottageService } from '../services/cottage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-tourist-cottages',
  standalone: true,
  imports: [TouristMenuComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './tourist-cottages.component.html',
  styleUrl: './tourist-cottages.component.css'
})
export class TouristCottagesComponent implements OnInit{

  ngOnInit(): void {
    this.cs.getAllCottages().subscribe(data=>{
      this.allCottages=data
      this.srchCottages=data
    })
  }

  private router = inject(Router)
  private cs = inject(CottageService)

  allCottages: Cottage[]= []
  srchCottages: Cottage[]=[]

  parm_name = ""
  parm_place = ""

  avg_note(c: Cottage){
    let sum = 0;
    for(let i = 0; i < c.lista_ocena.length;i++){
      sum = sum + c.lista_ocena[i].ocena
    }
    if(sum == 0){
      return 0
    }else{
      return parseFloat((sum / c.lista_ocena.length).toFixed(2))
    }
  }

  @Input() c: { ocene: number[] } = { ocene: [] };
  stars: number[] = [0,1,2,3,4]

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

  stars_low_high() {
    this.srchCottages.sort((a,b)=>{
      return this.avg_note(a)-this.avg_note(b)
    })
  }

  stars_high_low() {
    this.srchCottages.sort((a,b)=>{
      return this.avg_note(b)-this.avg_note(a)
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
          case "stars":
            this.stars_low_high();
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
          case "stars":
            this.stars_high_low();
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

  // private router = inject(Router)

  login(){
    this.router.navigate(['login'])
  }

  register(){
    this.router.navigate(['registration'])
  }

  trackById(index: number, item: Cottage): any {
    // prefer a unique DB id; fallback to 'id' or index
    return item.id ?? `${item.naziv ?? ''}::${index}`;
  }


  passChange(){
    this.router.navigate(['../updatePassword'])
  }

  logout(){
    localStorage.clear()
    this.router.navigate(['login'])
  }


  item_bubble = false
  toggleBubble() {
    this.item_bubble = !this.item_bubble;
  }
}
