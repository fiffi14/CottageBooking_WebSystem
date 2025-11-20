import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../models/user';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { TouristMenuComponent } from '../tourist-menu/tourist-menu.component';

@Component({
  selector: 'app-tourist-home',
  standalone: true,
  imports: [RouterLink, FormsModule, TouristMenuComponent],
  templateUrl: './tourist-home.component.html',
  styleUrl: './tourist-home.component.css'
})
export class TouristHomeComponent implements OnInit{
  ngOnInit(): void {
    let u = localStorage.getItem("logged")
    if( u!= null){
      this.us.getUserByUsername(u).subscribe(data=>{
        this.tourist=data
        this.tourist = data
        this.ime = this.tourist.ime
        this.prezime = this.tourist.prezime
        this.pol = (this.tourist.pol=='m')?"Muški":"Ženski"
        this.adresa = this.tourist.adresa
        this.email = this.tourist.email
        this.broj_kartice = this.tourist.broj_kartice
        this.telefon = this.tourist.telefon

      })
    }
  }

  private us = inject(UserService)
  private router = inject(Router)

  tourist: User = new User()
  updating = false


  ime = ""
  prezime = ""
  pol = ""
  adresa = ""
  telefon = ""
  email = ""
  broj_kartice = ""

  imgFile: File | null = null

  // category = ""
  // value = ""
  err = ""

  update_flag() {
    this.updating=true
  }

  give_up(){
    this.updating=false
    window.location.reload()
  }



  // decision(){
  //   // alert('hello')
  //   switch(this.category){
  //     case "ime":
  //       this.value = this.tourist.ime
  //       break
  //     case "prezime":
  //       this.value = this.tourist.prezime
  //       break
  //     case "adresa":
  //       this.value = this.tourist.adresa
  //       break
  //     case "telefon":
  //       this.value = this.tourist.telefon
  //       break
  //     case "email":
  //       this.value = this.tourist.email
  //       break

  //     case "broj_kartice":
  //       this.value = this.tourist.broj_kartice
  //       break

  //   }
  //   // alert(this.category)
  // }

  update(){
    if(this.ime!=this.tourist.ime){
        this.us.updateFirstname(this.tourist.korisnicko_ime, this.ime).subscribe(data=>{
          if(data.message.startsWith("Neuspešno")) alert(data.message)
      })
    }

    if(this.prezime!=this.tourist.prezime){
      this.us.updateLastname(this.tourist.korisnicko_ime, this.prezime).subscribe(data=>{
        if(data.message.startsWith("Neuspešno")) alert(data.message)
      })
    }



    if(this.adresa!=this.tourist.adresa){

      this.address_regex()
      if(this.addr_check){
        this.us.updateAddress(this.tourist.korisnicko_ime, this.adresa).subscribe(data=>{
          if(data.message.startsWith("Neuspešno")) alert(data.message)
        })
      }
    }


    if(this.telefon!=this.tourist.telefon){

      this.phone_regex()
      if(this.phone_check){
        this.us.updatePhoneNumber(this.tourist.korisnicko_ime, this.telefon).subscribe(data=>{
          if(data.message.startsWith("Neuspešno")) alert(data.message)
        })
      }
    }


    if(this.email!=this.tourist.email){

      this.email_regex()
      if(this.email_check){
        this.us.updateEmail(this.tourist.korisnicko_ime, this.email).subscribe(data=>{
          if(data.message.startsWith("Neuspešno")) alert(data.message)
        })
      } else return
    }

    if(this.imgFile!=null){
      this.us.updateImage(this.tourist.korisnicko_ime, this.imgFile as File).subscribe(data=>{
        if(data.message.startsWith("Neuspešno")) alert(data.message)
      })
    }



    if(this.broj_kartice!=this.tourist.broj_kartice){

      this.card_check()
      if(this.card_type==0) return
      else {
        this.us.updateCardNumber(this.tourist.korisnicko_ime, this.broj_kartice).subscribe(data=>{
          if(data.message.startsWith("Neuspešno")) alert(data.message)
        })
      }
    }
    alert("Uspešno ažuriranje!")

    this.updating=false
    window.location.reload()
  }

  upload(event: any) {
    this.imgFile = event.target.files[0]

    const selectedImgURL = event.target.result

    let img = new Image()
    img.src = URL.createObjectURL(this.imgFile as File)

    img.onload = () => {
      if(img.height<100 || img.width<100 || img.height>300 || img.width>300){
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

  phone_check = false
  email_check = false
  addr_check = false



  phone_regex(){
    let r = /^\+[0-9]{7,17}$/

    if(this.telefon.length>17){
      this.err= "Kontakt telefon je predugačak!"
    }
    else if(this.telefon.length<7){
      this.err= "Kontakt telefon je prekratak!"
    }
    else if(!r.test(this.telefon)){
      this.err= "Kontakt telefon je lošeg formata!"
    } else{
      this.err = ""
      this.phone_check = true
    }
  }

  address_regex(){
    let r = /^[A-Z][a-zA-Z\s\.]+,\s*\d+[A-Za-z]?$/

    if(!r.test(this.adresa)){
      this.err = "Adresa je lošeg formata!"
    } else{

      this.err = ""
      this.addr_check = true
    }// return "Dobra adresa"
  }

  email_regex() {
    let r = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if(!r.test(this.email)){
      this.err= "E-mail je lošeg formata!"
    } else{

      this.email_check = true
      this.err = ""
    }
    // return "Dobar email"
  }

  card_type = 0
  diners = false
  visa = false
  master = false

  card_check(){
    if(this.broj_kartice.length<15){
      this.err = "Nedovoljno cifara!"
      this.card_type = 0
    } else if(this.broj_kartice.length>16) {
      this.err = "Suviše cifara"
      this.card_type=0
    } else if(this.broj_kartice.length==15) {
      if(
        this.broj_kartice.startsWith('300') ||
        this.broj_kartice.startsWith('301') ||
        this.broj_kartice.startsWith('302') ||
        this.broj_kartice.startsWith('303') ||
        this.broj_kartice.startsWith('36') ||
        this.broj_kartice.startsWith('38')
      ) {
        this.diners = true
        this.visa = this.master = false
        this.card_type = 1
        this.err = ""
      } else {
        this.err = "Pogrešan broj Diners kartice!"
        this.visa=this.diners=this.master=false
        this.card_type=0
      }

    } else if(this.broj_kartice.length==16) {
      if(
        this.broj_kartice.startsWith('51') ||
        this.broj_kartice.startsWith('52') ||
        this.broj_kartice.startsWith('53') ||
        this.broj_kartice.startsWith('54') ||
        this.broj_kartice.startsWith('55')
      ){
        this.master = true
        this.visa = this.diners = false
        this.card_type = 2
        this.err = ""
      } else if(
        this.broj_kartice.startsWith('4539') ||
        this.broj_kartice.startsWith('4556') ||
        this.broj_kartice.startsWith('4916') ||
        this.broj_kartice.startsWith('4532') ||
        this.broj_kartice.startsWith('4929') ||
        this.broj_kartice.startsWith('4485') ||
        this.broj_kartice.startsWith('4716')

      ) {
        this.visa = true
        this.master = this.diners = false
        this.card_type = 3
        this.err = ""
      } else {
        this.err = "Pogrešan broj kartice!"
        this.visa=this.diners=this.master=false
        this.card_type=0
      }
    }
  }


  passChange(){
    this.router.navigate(['../updatePassword'])
  }

  logout(){
    localStorage.clear()
    this.router.navigate(['login'])
  }

  back_to_def(){
    this.us.deleteProfilna(this.tourist.korisnicko_ime).subscribe(data=>{
      alert(data.message)
      window.location.reload()
    })
  }

}


// if(this.category==""){
//       this.err="Nije izabrana koja kategorija se menja!"
//       return
//     }

//     this.err = ""

//     if(this.category=="profilna" && this.imgFile==null){
//       this.err="Nije izabrana nova slika!"
//       return
//     }
//     else if(this.value=="" && this.category!="profilna"){
//       this.err="Nije uneta nova vrednost!"
//       return
//     }
//     this.err=""




//     switch(this.category){
//       case "ime":
//         if(this.value==this.tourist.ime){
//           this.err="Niste promenili novu vrednost!"
//           return
//         }
//         this.us.updateFirstname(this.tourist.korisnicko_ime, this.value).subscribe(data=>{
//           alert(data.message)
//         })
//         break
//       case "prezime":
//         if(this.value==this.tourist.prezime){
//           this.err="Niste promenili novu vrednost!"
//           return
//         }
//         this.us.updateLastname(this.tourist.korisnicko_ime, this.value).subscribe(data=>{
//           alert(data.message)
//         })
//         break
//       case "adresa":
//         if(this.value==this.tourist.adresa){
//           this.err="Niste promenili novu vrednost!"
//           return
//         }
//         this.address_regex()
//         if(this.addr_check){
//           this.us.updateAddress(this.tourist.korisnicko_ime, this.value).subscribe(data=>{
//             alert(data.message)
//           })
//         } else return
//         break
//       case "telefon":
//         if(this.value==this.tourist.telefon){
//           this.err="Niste promenili novu vrednost!"
//           return
//         }
//         this.phone_regex()
//         if(this.phone_check){
//           this.us.updatePhoneNumber(this.tourist.korisnicko_ime, this.value).subscribe(data=>{
//             alert(data.message)
//           })
//         } else return
//         break
//       case "email":
//         if(this.value==this.tourist.email){
//           this.err="Niste promenili novu vrednost!"
//           return
//         }
//         this.email_regex()
//         if(this.email_check){
//           this.us.updateEmail(this.tourist.korisnicko_ime, this.value).subscribe(data=>{
//             alert(data.message)
//           })
//         } else return
//         break

//       case "profilna":
//         this.us.updateImage(this.tourist.korisnicko_ime, this.imgFile as File).subscribe(data=>{
//           alert(data.message)
//         })
//         break

//       case "broj_kartice":
//         if(this.value==this.tourist.broj_kartice){
//           this.err="Niste promenili novu vrednost!"
//           return
//         }
//         this.card_check()
//         if(this.card_type==0) return
//         else {
//           this.us.updateCardNumber(this.tourist.korisnicko_ime, this.value).subscribe(data=>{
//             alert(data.message)
//           })
//         }
//         break

//     }
