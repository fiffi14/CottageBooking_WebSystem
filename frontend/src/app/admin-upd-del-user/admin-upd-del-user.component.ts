import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-upd-del-user',
  standalone: true,
  imports: [FormsModule, AdminMenuComponent],
  templateUrl: './admin-upd-del-user.component.html',
  styleUrl: './admin-upd-del-user.component.css'
})
export class AdminUpdDelUserComponent {


  private router = inject(Router)
  private us = inject(UserService)

  logout(){
    if(localStorage.getItem("logged")!=null){
      localStorage.removeItem("logged")
      this.router.navigate(['../login/admin'])
    }
  }

  targetUser = ""
  // option = ""
  category = ""
  err = ""
  value = ""

  user_good = false

  userExists(){
    this.us.getUserByUsername(this.targetUser).subscribe(data=>{
      if(data==null) this.user_good=false
      else this.user_good=true
    })
  }

  update(){
    if(this.targetUser==""){
      this.err="Nije naveden korisnik!"
      return
    }

    this.err=""

    if(!this.user_good){
      this.err="Korisničko ime nije dobro!"
      return
    }

    this.err=""

    if(this.category==""){
      this.err="Nije izabrana koja kategorija se menja!"
      return
    }

    this.err = ""

    if(this.category=="profilna" && this.imgFile==null){
      this.err="Nije izabrana nova slika!"
      return
    }
    else if(this.value=="" && this.category!="profilna"){
      this.err="Nije uneta nova vrednost!"
      return
    }
    this.err=""




    switch(this.category){
      case "ime":
        this.us.updateFirstname(this.targetUser, this.value).subscribe(data=>{
          alert(data.message)
        })
        break
      case "prezime":
        this.us.updateLastname(this.targetUser, this.value).subscribe(data=>{
          alert(data.message)
        })
        break
      case "adresa":
        this.address_regex()
        if(this.addr_check){
          this.us.updateAddress(this.targetUser, this.value).subscribe(data=>{
            alert(data.message)
          })
        }
        break
      case "telefon":
        this.phone_regex()
        if(this.phone_check){
          this.us.updatePhoneNumber(this.targetUser, this.value).subscribe(data=>{
            alert(data.message)
          })
        }
        break
      case "email":
        this.email_regex()
        if(this.email_check){
          this.us.updateEmail(this.targetUser, this.value).subscribe(data=>{
            alert(data.message)
          })
        }
        break

      case "profilna":
        this.us.updateImage(this.targetUser, this.imgFile as File).subscribe(data=>{
          alert(data.message)
        })
        break

      case "broj_kartice":
        this.card_check();
        if(this.card_type!=0){
          this.us.updateCardNumber(this.targetUser, this.value).subscribe(data=>{
            alert(data.message)
          })
        }
        break

    }
  }

  imgFile: File | null = null

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

  obrisi(){
    this.us.deleteUser(this.targetUser).subscribe(data=>{
      this.err=data.message
    })
  }

  aktiviraj(){
    this.us.activateUser(this.targetUser).subscribe(data=>{
      this.err=data.message
    })
  }

  deaktiviraj(){
    this.us.deactivateUser(this.targetUser).subscribe(data=>{
      this.err=data.message
    })
  }



  // pass_check = false
  phone_check = false
  email_check = false
  addr_check = false



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

  address_regex(){
    let r = /^[A-Z][a-zA-Z\s\.]+,\s*\d+[A-Za-z]?$/

    if(!r.test(this.value)){
      this.err = "Adresa je lošeg formata!"
    } else{

      this.err = ""
      this.addr_check = true
    }// return "Dobra adresa"
  }

  email_regex() {
    let r = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if(!r.test(this.value)){
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
    if(this.value.length<15){
      this.err = "Nedovoljno cifara!"
      this.card_type = 0
    } else if(this.value.length>16) {
      this.err = "Suviše cifara"
      this.card_type=0
    } else if(this.value.length==15) {
      if(
        this.value.startsWith('300') ||
        this.value.startsWith('301') ||
        this.value.startsWith('302') ||
        this.value.startsWith('303') ||
        this.value.startsWith('36') ||
        this.value.startsWith('38')
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

    } else if(this.value.length==16) {
      if(
        this.value.startsWith('51') ||
        this.value.startsWith('52') ||
        this.value.startsWith('53') ||
        this.value.startsWith('54') ||
        this.value.startsWith('55')
      ){
        this.master = true
        this.visa = this.diners = false
        this.card_type = 2
        this.err = ""
      } else if(
        this.value.startsWith('4539') ||
        this.value.startsWith('4556') ||
        this.value.startsWith('4916') ||
        this.value.startsWith('4532') ||
        this.value.startsWith('4929') ||
        this.value.startsWith('4485') ||
        this.value.startsWith('4716')

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


}
