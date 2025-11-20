import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css'
})
export class LoginAdminComponent {
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
          if(data==null) this.msg="Nepravilni lozinka ili korisničko ime!"
          else{
            this.msg=""
            switch(data.status){
              case "neregistrovan":
                this.msg = "Nije Vam odobren pristup!"
                return

              case "neaktivan":
                this.msg = "Vaš nalog je deaktiviran!"
                return
            }
            if(data.tip!="admin") {
              this.msg="Dozvoljen pristup samo za admine!"
              return
            }
            localStorage.setItem("logged", data.korisnicko_ime)
            this.router.navigate(['/admin'])
            }
        })
      }
    }

}
