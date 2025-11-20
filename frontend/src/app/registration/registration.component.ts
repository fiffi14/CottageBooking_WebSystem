import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, RequiredValidator } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {
  ngOnInit(): void {
    this.korisnicko_ime = ""
    this.lozinka = ""
    this.ime = ""
    this.prezime = ""
    this.pol = "m"
    this.adresa = ""
    this.telefon = ""
    this.email = ""
    this.profilna = "profileImages/def_profile.png"
    this.broj_kartice = ""
    this.tip = "turista"
    this.err_msg1 = ""
    this.err_msg2 = ""
    this.err_msg3 = ""
    this.err_msg4 = ""
    this.err_msg5 = ""
    this.err_msg6 = ""
    this.err_msg7 = ""
    this.err_msg8 = ""

    this.err_user = ""
    this.err_img = ""
    this.pass_check = false
    this.phone_check = false
    this.email_check = false
    this.addr_check = false

    this.card_type = 0
    this.diners = false
    this.visa = false
    this.master = false

    this.imgFile = null
  }

  private us = inject(UserService)


  korisnicko_ime = ""
  lozinka = ""
  ime = ""
  prezime = ""
  pol = "m"
  adresa = ""
  telefon = ""
  email = ""
  profilna = "profileImages/def_profile.png"
  broj_kartice = ""
  tip = "turista"

  newUser: User = new User()

  imgFile: File | null = null

  err_msg1 = ""
  err_msg2 = ""
  err_msg3 = ""
  err_msg4 = ""
  err_msg5 = ""
  err_msg6 = ""
  err_msg7 = ""
  err_msg8 = ""

  err_user = ""
  // err_card = ""


  register() {

    if(
      this.korisnicko_ime==""||
      this.lozinka=="" ||
      this.ime == "" ||
      this.prezime == "" ||
      this.adresa == "" ||
      this.broj_kartice == "" ||
      this.telefon == "" ||
      this.email == ""
    ){

      this.err_user = "Niste popunili sva polja!"
      return
    }

    // if(this.pass_regex()!="Dobra lozinka"){
    //   this.err_msg2=this.pass_regex()
    // } else this.err_msg2=""

    // if(this.phone_regex()!="Dobar kontakt"){
    //   this.err_msg5=this.phone_regex()
    // } else this.err_msg5=""

    // if(this.address_regex()!="Dobra adresa"){
    //   this.err_msg4=this.address_regex()
    // } else this.err_msg4=""

    // if(this.email_regex()!="Dobar email"){
    //   this.err_msg6=this.email_regex()
    // } else this.err_msg4=""

    if(!this.addr_check || !this.pass_check || !this.email_check || !this.phone_check || this.card_type==0){
      this.err_user = "Ispravite formate!"
      return
    } else this.err_user=""


    this.us.getUserByUsername(this.korisnicko_ime).subscribe(user=>{
      if(user!=null){
        if(user.status=="aktiviran" || user.status=="neregistrovan"){
          this.err_msg1="Korisničko ime već postoji!"
          return
        } else if(user.status=="odbijen"){
          this.err_msg1="Korisničko ime je nedozvoljeno!"
          return
        }
      } else this.err_msg1=""
    })

    this.us.getUserByMail(this.email).subscribe(data=>{
      if(data!=null){
        if(data.status=="aktiviran" || data.status=="neregistrovan"){
          this.err_msg7="E-mail se već koristi!"
          return
        } else if(data.status=="odbijen"){
          this.err_msg7="E-mail je povezan na odbijen zahtev!"
          return
        }
      } else{
        this.err_msg7=""
      }
    })

    this.newUser.korisnicko_ime = this.korisnicko_ime
    this.newUser.lozinka = this.lozinka
    this.newUser.ime = this.ime
    this.newUser.prezime = this.prezime
    this.newUser.adresa = this.adresa
    this.newUser.telefon = this.telefon
    this.newUser.pol = this.pol
    this.newUser.email = this.email
    this.newUser.tip = this.tip
    this.newUser.status = "neregistrovan"
    this.newUser.profilna = this.profilna
    this.newUser.broj_kartice = this.broj_kartice

    //register i change image na beku

    this.us.registerUser(this.newUser).subscribe(data=>{
      if(this.imgFile!=null){
        this.us.updateImage(this.korisnicko_ime, this.imgFile as File).subscribe(data=>{
          // alert(data.message)
        })
      }
      // this.err_user = data.message
      alert(data.message)
      if(!data.message.startsWith("Došlo je do greške")) window.location.reload()

    })

    // if(this.err_user==="Uspešna registracija!"){
    //   this.ngOnInit();
    // }
  }

  pass_check = false
  phone_check = false
  email_check = false
  addr_check = false

  pass_regex(){
    let r = /^(?=.{6,10}$)(?=(?:.*[A-Z]))(?=(?:.*[a-z]){3,})(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z][A-Za-z0-9!@#$%^&*()_\-+=[\]{};':"\\|,.<>\/?`~]{5,9}$/

    if(this.lozinka.length>10){
      this.err_msg2 = "Lozinka je predugačka!"
    }
    else if(this.lozinka.length<6){
      this.err_msg2 = "Lozinka je prekratka!"
    }
    else if(!r.test(this.lozinka)){
      this.err_msg2 = "Lozinka je lošeg formata!"
    } else{

      this.pass_check = true
      this.err_msg2 = ""
    }
  }

  phone_regex(){
    let r = /^\+[0-9]{7,17}$/

    if(this.telefon.length>17){
      this.err_msg6= "Kontakt telefon je predugačak!"
    }
    else if(this.telefon.length<7){
      this.err_msg6= "Kontakt telefon je prekratak!"
    }
    else if(!r.test(this.telefon)){
      this.err_msg6= "Kontakt telefon je lošeg formata!"
    } else{
      this.err_msg6 = ""
      this.phone_check = true
    }
  }

  address_regex(){
    let r = /^[A-Z][a-zA-Z\s\.]+,\s*\d+[A-Za-z]?$/

    if(!r.test(this.adresa)){
      this.err_msg5 = "Adresa je lošeg formata!"
    } else{

      this.err_msg5 = ""
      this.addr_check = true
    }// return "Dobra adresa"
  }

  email_regex() {
    let r = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if(!r.test(this.email)){
      this.err_msg7= "E-mail je lošeg formata!"
    } else{

      this.email_check = true
      this.err_msg7 = ""
    }
    // return "Dobar email"
  }

  card_type = 0
  diners = false
  visa = false
  master = false

  card_check(){
    if(this.broj_kartice.length<15){
      this.err_msg8 = "Nedovoljno cifara!"
      this.card_type = 0
    } else if(this.broj_kartice.length>16) {
      this.err_msg8 = "Suviše cifara"
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
        this.err_msg8 = ""
      } else {
        this.err_msg8 = "Pogrešan broj Diners kartice!"
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
        this.err_msg8 = ""
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
        this.err_msg8 = ""
      } else {
        this.err_msg8 = "Pogrešan broj kartice!"
        this.visa=this.diners=this.master=false
        this.card_type=0
      }
    }
  }

  err_img = ""

  upload(event: any) {
    this.imgFile = event.target.files[0]

    const selectedImgURL = event.target.result

    let img = new Image()
    img.src = URL.createObjectURL(this.imgFile as File)

    img.onload = () => {
      if(img.height<100 || img.width<100 || img.height>300 || img.width>300){
        this.err_img = "Nedozvoljavajuće dimenzije slike!"
        this.imgFile = null
      } else {
        this.err_img = ""
      }
    };

    img.onerror = () => {
      this.err_img = "Došlo je do greške!"
      this.imgFile = null
    }


  }

  private router = inject(Router)

  home(){
    this.router.navigate([''])
  }

  login(){
    this.router.navigate(['login'])
  }
}
