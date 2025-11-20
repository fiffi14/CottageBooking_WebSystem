import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
// import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css'
})
export class UpdatePasswordComponent implements OnInit{
  ngOnInit(): void {
    let s = localStorage.getItem("logged")
    if(s!=null){
      this.username = s
    }

    this.us.getUserByUsername(this.username).subscribe(data=>{
      this.user=data
    })
  }

  oldPass = ""
  newPass = ""
  rptPass = ""
  username = ""
  user: User = new User()

  err = ""
  pass_err = ""
  pass_check: boolean=false;

  private us = inject(UserService)
  private router = inject(Router)

  go_back(){
    if(this.user.tip=="admin"){
      this.router.navigate(['../admin'])
    } else if(this.user.tip=="turista"){
      this.router.navigate(['../tourist'])
    } else if(this.user.tip=="vlasnik"){
      this.router.navigate(['../owner'])
    }
  }


  updatePass(){

    if(this.oldPass=="" || this.newPass=="" || this.rptPass==""){
      this.err="Niste popunili sva polja!"
      return
    }

    if(!this.pass_check) return

    this.us.getUserByUsername(this.username).subscribe(data=>{
      this.user = data
      if(this.user.lozinka!=this.oldPass){
        this.err = "Niste uneli ispravnu staru lozinku!"
        return
      }
      this.err = ""
      if(this.newPass != this.rptPass){
        this.err = "Nove lozinke se ne poklapaju!"
        return
      }

      this.err = ""

      this.us.updatePassword(this.username, this.newPass).subscribe(data=>{
        alert(data.message)
        localStorage.removeItem("logged")
        if(this.user.tip=="admin") this.router.navigate(['../login/admin'])
        else this.router.navigate(['../login'])
      })

    })
  }


  pass_regex(){
    let r = /^(?=.{6,10}$)(?=(?:.*[A-Z]))(?=(?:.*[a-z]){3,})(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z][A-Za-z0-9!@#$%^&*()_\-+=[\]{};':"\\|,.<>\/?`~]{5,9}$/

    if(this.newPass.length>10){
      this.pass_err = "Lozinka je predugačka!"
    }
    else if(this.newPass.length<6){
      this.pass_err =  "Lozinka je prekratka!"
    }
    else if(!r.test(this.newPass)){
      this.pass_err =  "Lozinka je lošeg formata!"
    } else{

      this.pass_check = true
      this.pass_err = ""
    }
  }



  visible_old = false
  visible_new1 = false
  visible_new2 = false

  toggle_old(){
    this.visible_old = !this.visible_old
  }

  toggle_new1(){
    this.visible_new1 = !this.visible_new1
  }
  toggle_new2(){
    this.visible_new2 = !this.visible_new2
  }

}
