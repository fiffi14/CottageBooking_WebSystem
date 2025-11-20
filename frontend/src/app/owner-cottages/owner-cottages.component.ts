import { Component, inject, OnInit } from '@angular/core';
import { OwnerMenuComponent } from '../owner-menu/owner-menu.component';
import { UserService } from '../services/user.service';
import { CottageService } from '../services/cottage.service';
import { ReservationService } from '../services/reservation.service';
import { Router } from '@angular/router';
import { Cottage } from '../models/cottage';
import { User } from '../models/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-owner-cottages',
  standalone: true,
  imports: [OwnerMenuComponent, FormsModule],
  templateUrl: './owner-cottages.component.html',
  styleUrl: './owner-cottages.component.css'
})
export class OwnerCottagesComponent implements OnInit{
  ngOnInit(): void {
    let o = localStorage.getItem("logged")
    if(o!=null){
        this.us.getUserByUsername(o).subscribe(data=>{
          this.owner = data

        })

        this.cs.getCottagesByOwner(o).subscribe(data=>{
          this.myCottages=data
          this.myCottages.forEach(e=>{
            // this.pics.push(e.galerija)
            this.ind.set(e.id, 0)
          })
        })

        this.cs.getAllCottages().subscribe(data=>{
          this.allCottages=data
        })
    }

    // this.cs.automaticUnblockCottages().subscribe(data=>{
    //   // alert(data.message)
    // })
  }

  private cs = inject(CottageService)
  private us = inject(UserService)
  private rs = inject(ReservationService)
  private router = inject(Router)

  myCottages: Cottage[]=[]
  allCottages: Cottage[]= []
  owner: User = new User()
  // pics: Array<string[]> = []

  ind = new Map<number, number>

  logout(){
    localStorage.clear()
    this.router.navigate(['login'])
  }

  chPass(){
    this.router.navigate(['../updatePassword'])
  }

  nextStep(c: Cottage) {
    // this.ind=(this.ind+1)% c.galerija.length

    this.ind.set(c.id, (this.ind.get(c.id)! + 1) % c.galerija.length)

    return this.ind.get(c.id)
  }
  prevStep(c : Cottage) {
    // this.ind=(this.ind-1<0 ? c.galerija.length-1 : this.ind-1)%c.galerija.length

    this.ind.set(c.id, (this.ind.get(c.id)! - 1 < 0 ? c.galerija.length-1 : this.ind.get(c.id)!-1) % c.galerija.length)

    return this.ind.get(c.id)
  }

  err = ""
  value = ""
  category = ""
  sel_cottage: Cottage = new Cottage()
  updating = false

  start_update(c:Cottage){
    this.sel_cottage = c
    this.updating = true
    this.ask_delete = false
  }

  giveup(){
    this.sel_cottage = new Cottage()
    this.updating = false
    this.ask_delete = false
  }


  decision(){
    // alert('hello')
    switch(this.category){
      case "naziv":
        this.value = this.sel_cottage.naziv
        break
      case "mesto":
        this.value = this.sel_cottage.mesto
        break
      case "usluge":
        this.value = this.sel_cottage.usluge
        break
      case "telefon":
        this.value = this.sel_cottage.telefon
        break
      case "broj_osoba":
        this.value = String(this.sel_cottage.broj_osoba)
        break
      case "kvadratura":
        this.value = String(this.sel_cottage.kvadratura)
        break
      case "letnji":
        this.value = String(this.sel_cottage.letnji_cenovnik)
        break
      case "zimski":
        this.value = String(this.sel_cottage.zimski_cenovnik)
        break
      case "koordinate":
        this.value = String(this.sel_cottage.koordinate)
        break
    }
  // alert(this.category)
  }


  phone_check = false


  phone_regex(){
    let r = /^\+[0-9]{7,17}$/

    if(this.value.length>17){
      this.err= "Kontakt telefon je predugačak!"
    }
    else if(this.value.length<7){
      this.err= "Kontakt telefon je prekratak!"
    }
    else if(!r.test(this.value)){
      this.err= "Kontakt telefon je lošeg formata!"
    } else{
      this.err = ""
      this.phone_check = true
    }
  }


  pic_to_delete = ""

  imgFile: File | null = null

  obrisi_sliku(id: number) {

    this.cs.deleteImage(id, this.pic_to_delete).subscribe(data=>{
      alert(data.message)
    })
  }

  upload(event: any) {
    this.imgFile = event.target.files[0]

    const selectedImgURL = event.target.result

    let img = new Image()
    img.src = URL.createObjectURL(this.imgFile as File)

    img.onload = () => {
      if(img.height<100 || img.width<100){
        this.err = "Nedozvoljavajuće dimenzije slike!"
        this.imgFile = null
      } else {
        this.err = ""
      }
    };

    img.onerror = () => {
      this.err = "Došlo je do greške!"
      this.imgFile = null
    }



  }

  ask_delete = false

  delete1(){
    this.ask_delete = true
  }

  giveup2(){
    this.ask_delete = false
  }
  delete2(c: Cottage){
    this.rs.delRes(c.naziv, c.vlasnik).subscribe(data=>{
      alert(data.message)
    })
    for(let p of c.galerija){
      this.cs.deleteImage(c.id, p).subscribe(data=>{})
    }
    this.cs.deleteCottage(c.id).subscribe(data=>{
      alert(data.message)
      window.location.reload()
    })
    this.ask_delete=false
  }

  save(){
    if(this.category==""){
      this.err="Mora se uneti kategorija prvo!"
      return
    }
    this.err=""

    if(this.value=="" && this.category!="galerija"){
      this.err="Mora se uneti nova vrednost!"
      return
    }
    this.err=""

    switch(this.category){
      case "naziv":
        if(this.value!=this.sel_cottage.naziv){
            this.cs.updateNaziv(this.sel_cottage.id, this.value).subscribe(data=>{
            if(data.message.startsWith("Neuspešno")) alert(data.message)
          })
        } else{
          this.err = "Unesite novi naziv!"
          return
        }
        break

      case "mesto":
        if(this.value!=this.sel_cottage.mesto){
            this.cs.updateMesto(this.sel_cottage.id, this.value).subscribe(data=>{
            if(data.message.startsWith("Neuspešno")) alert(data.message)
          })
        } else{
          this.err = "Unesite novo mesto!"
          return
        }
        break

      case "usluge":
        if(this.value!=this.sel_cottage.usluge){
            this.cs.updateUsluge(this.sel_cottage.id, this.value).subscribe(data=>{
            if(data.message.startsWith("Neuspešno")) alert(data.message)
          })
        } else{
          this.err = "Unesite novu uslugu!"
          return
        }
        break

      case "telefon":
        if(this.value!=this.sel_cottage.telefon){
          this.err=""
          this.phone_regex()
          if(this.phone_check){
              this.cs.updateTelefon(this.sel_cottage.id, this.value).subscribe(data=>{
              if(data.message.startsWith("Neuspešno")) alert(data.message)
            })
          }else{
            this.err="Proverite format kontakt telefona!"
            return
          }
        } else{
          this.err = "Unesite nov kontakt telefon!"
          return
        }
        break

      case "broj_osoba":
        if(Number(this.value)<0 || !this.isNumeric(this.value)){
          this.err="Unesite pozitivnu numeričku vrednost!"
          return
        }
        if(Number(this.value)!=this.sel_cottage.broj_osoba){
            this.cs.updateBrojOsoba(this.sel_cottage.id, Number(this.value)).subscribe(data=>{
            if(data.message.startsWith("Neuspešno")) alert(data.message)
          })
        } else{
          this.err = "Unesite novi broj osoba!"
          return
        }
        break

      case "kvadratura":
        if(Number(this.value)<0 || !this.isNumeric(this.value)){
          this.err="Unesite pozitivnu numeričku vrednost!"
          return
        }
        if(Number(this.value)!=this.sel_cottage.kvadratura){
            this.cs.updateKvadratura(this.sel_cottage.id, Number(this.value)).subscribe(data=>{
            if(data.message.startsWith("Neuspešno")) alert(data.message)
          })
        } else{
          this.err = "Unesite novu kvadraturu!"
          return
        }
        break

      case "letnji":
        if(Number(this.value)<0  || !this.isNumeric(this.value)){
          this.err="Unesite pozitivnu numeričku vrednost!"
          return
        }
        if(Number(this.value)!=this.sel_cottage.letnji_cenovnik){
            this.cs.updateLetnji(this.sel_cottage.id, Number(this.value)).subscribe(data=>{
            if(data.message.startsWith("Neuspešno")) alert(data.message)
          })
        } else{
          this.err = "Unesite novi letnji cenovnik!"
          return
        }
        break

      case "zimski":
        if(Number(this.value)<0 || !this.isNumeric(this.value)){
          this.err="Unesite pozitivnu numeričku vrednost!"
          return
        }
        if(Number(this.value)!=this.sel_cottage.zimski_cenovnik){
            this.cs.updateZimski(this.sel_cottage.id, Number(this.value)).subscribe(data=>{
            if(data.message.startsWith("Neuspešno")) alert(data.message)
          })
        } else{
          this.err = "Unesite novi zimski cenovnik!"
          return
        }
        break

      case "koordinate":
        this.coord_regex()
        if(!this.coord_check){
          this.err="Proverite format i vrednosti koordinata!"
          return
        }
        this.err = ""
        if(this.value!=this.sel_cottage.koordinate){
            this.cs.updateKoordinate(this.sel_cottage.id, this.value).subscribe(data=>{
            if(data.message.startsWith("Neuspešno")) alert(data.message)
          })
        } else{
          this.err = "Unesite nove kordinate!"
          return
        }
        break

      case "galerija":  // azuriranje ind
        if(this.imgFile!=null){
          this.cs.updateImage(this.sel_cottage.id, this.imgFile as File).subscribe(data=>{
            if(data.message.startsWith("Neuspešno")) alert(data.message)
          })
        } else{
          this.err = "Unesite novu sliku!"
          return
        }
        break

    }

    alert("Uspešno ažuriranje!")
    window.location.reload()
  }


  coord_check = false

  coord_regex(){

    let r = /^[-]?(90(\.0+)?|[0-8]?\d(\.\d+)?)\s*,\s*[-]?(180(\.0+)?|(1[0-7]\d|\d{1,2})(\.\d+)?)$/

    if(!r.test(this.value)){
      this.err= "Koordinate su lošeg formata!"
      this.coord_check = false
    } else {

      this.coord_check = true
      this.err = ""
    }
    // return "Dobar email"

  }

  isNumeric(str: string) {
    return /^[0-9]+$/.test(str);
  }

  // adding cottage

  scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  n_naziv = ""
  n_mesto = ""
  n_usluge = ""
  n_letnji = 0
  n_zimski = 0
  n_telefon = ""
  n_koord = ""
  n_broj_osoba = 0
  n_kvadratura = 0
  n_galerija: Array<string>=[]
  err_reg = ""
  n_vikendica: Cottage = new Cottage()

  imgs: File[] = [];

  upload_multiple(event: any) {
    // this.imgs = [];
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    this.err_reg = "";

    Array.from(files).forEach((file) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          this.err_reg = "Nedozvoljavajuće dimenzije slike!";
        } else {
          this.imgs.push(file);
          console.log("Added:", file.name);
        }
      };

      img.onerror = () => {
        this.err_reg = "Došlo je do greške pri učitavanju slike!";
      };
    });
  }

  phone_check_reg = false
  phone_regex_reg(){
    let r = /^\+[0-9]{7,17}$/

    if(this.n_telefon.length>17){
      this.err_reg= "Kontakt telefon je predugačak!"
    }
    else if(this.n_telefon.length<7){
      this.err_reg= "Kontakt telefon je prekratak!"
    }
    else if(!r.test(this.n_telefon)){
      this.err_reg= "Kontakt telefon je lošeg formata!"
    } else{
      this.err_reg = ""
      this.phone_check = true
    }
  }

  coord_check_reg = false
  coord_regex_reg(){

    let r = /^[-]?(90(\.0+)?|[0-8]?\d(\.\d+)?)\s*,\s*[-]?(180(\.0+)?|(1[0-7]\d|\d{1,2})(\.\d+)?)$/

    if(!r.test(this.n_koord)){
      this.err_reg= "Koordinate su lošeg formata!"
      this.coord_check_reg = false
    } else {

      this.coord_check_reg = true
      this.err_reg = ""
    }
    // return "Dobar email"

  }


  register() {
    if(this.n_naziv == "" ||
      this.n_mesto == ""  || this.n_koord == "" ||
      this.n_letnji == 0 || this.n_zimski == 0 ||
      this.n_broj_osoba == 0 || this.n_kvadratura == 0) {

        this.err_reg = "Niste popunili sva polja!"
        return;
    }

    this.err_reg = ""
    if(this.n_broj_osoba<=0 || this.n_letnji<=0 || this.n_zimski<=0 || this.n_kvadratura<=0){
      this.err_reg = "Moraju biti unete pozitivne numeričke vrednosti gde je neophodno!"
      return;
    }

    this.err_reg = ""

    if(!this.isNumeric(String(this.n_broj_osoba)) || !this.isNumeric(String(this.n_letnji)) || !this.isNumeric(String(this.n_zimski)) || !this.isNumeric(String(this.n_kvadratura))){
      this.err_reg = "Moraju biti unete pozitivne numeričke vrednosti gde je neophodno!"
      return;
    }

    this.err_reg = ""


    this.phone_regex_reg()
    if(!this.phone_check_reg && this.n_telefon==""){
      this.err_reg = "Format kontakt telefona nije dobar!"
      return;
    }

    this.err_reg=""

    this.coord_regex_reg()
    if(!this.coord_check_reg){
      this.err_reg = "Format koordinata nije odgovarajuć!"
      return;
    }
    this.err_reg=""


    this.n_vikendica.id = this.find_idMax()
    this.n_vikendica.naziv = this.n_naziv
    this.n_vikendica.mesto = this.n_mesto
    this.n_vikendica.usluge = this.n_usluge
    this.n_vikendica.broj_osoba = this.n_broj_osoba
    this.n_vikendica.kvadratura = this.n_kvadratura
    this.n_vikendica.letnji_cenovnik = this.n_letnji
    this.n_vikendica.zimski_cenovnik = this.n_zimski
    this.n_vikendica.telefon = this.n_telefon==""? this.owner.telefon : this.n_telefon
    this.n_vikendica.koordinate = this.n_koord
    this.n_vikendica.blokiranaDo = ""
    this.n_vikendica.lista_ocena = []
    this.n_vikendica.vlasnik = this.owner.korisnicko_ime
    this.n_vikendica.galerija = []

    this.cs.regCottage(this.n_vikendica).subscribe(data=>{

      if (data.message.includes("Greška")) {
        this.err_reg = "Već je prijavljena vikendica sa istim imenom u istom mestu!";
        return;
      }

      const cottageId = Number(this.n_vikendica.id);

      if (this.imgs.length > 0) {
        // upload all images and wait for response
        this.cs.updateMultipleImages(cottageId, this.imgs).subscribe(res => {
          console.log("Images upload response:", res.message);
          window.location.reload(); // reload only after images are done
        }, err => {
          console.error("Error uploading images:", err);
        });
      } else {
        // no images, reload immediately
        window.location.reload();
      }
    })




  }

  find_idMax(){
    let res = 0
    for(let e of this.allCottages){
      res = Math.max(res, e.id)
    }
    return res+1
  }


  // uploadImagesSequentially(id: number, imgs: File[], done: () => void) {
  //   // stop when no images left
  //   if (imgs.length === 0) {
  //     done();
  //     return;
  //   }

  //   // take first image and the rest
  //   const [first, ...rest] = imgs;

  //   // upload the first one
  //   this.cs.updateImage(id, first).subscribe({
  //     next: () => {
  //       console.log(`Uploaded: ${first.name}`);
  //       // recursively upload the rest
  //       this.uploadImagesSequentially(id, rest, done);
  //     },
  //     error: (err) => {
  //       console.error(`Error uploading ${first.name}:`, err);
  //       // even if one fails, continue with next
  //       this.uploadImagesSequentially(id, rest, done);
  //     }
  //   });
  // }

}
