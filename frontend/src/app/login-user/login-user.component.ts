import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login-user',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.css'
})
export class LoginUserComponent {
  private userService = inject(UserService)
  private router = inject(Router)

  user = ""
  pass = ""
  msg = ""

  login() {
    if(this.user=="" && this.pass=="") this.msg="Niste uneli neophodne kredencijale!"
    else if(this.user=="") this.msg="Niste uneli korisničko ime!"
    else if(this.pass=="") this.msg="Niste uneli lozinku!"
    else {
      this.userService.login(this.user, this.pass).subscribe(data=>{
        if(data==null) {
          this.msg="Nepravilni lozinka ili korisničko ime!"
        }else{
          this.msg=""
          if(data.tip=="admin") {
            this.msg="Ovo nije login forma za admin-a!"
            return
          } else {
            switch(data.status){
              case "odbijen":
                this.msg = "Vaš zahtev za registraciju je odbijen!"
                return
              case "neregistrovan":
                this.msg = "Nije Vam odobren pristup!"
                return

              case "deaktiviran":
                this.msg = "Vaš nalog je deaktiviran!"
                return
            }
          }
          localStorage.setItem("logged", data.korisnicko_ime)

          if(data.tip=="turista") this.router.navigate(['tourist'])
          else if(data.tip=="vlasnik") this.router.navigate(['owner'])
          else this.msg="Nepostojeći tip korisnika!"
        }
      })
    }
  }


}
