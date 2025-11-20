import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CottageService } from '../services/cottage.service';
import { Cottage } from '../models/cottage';
import { TouristMenuComponent } from '../tourist-menu/tourist-menu.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Reservation } from '../models/reservation';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-tourist-spec-cottage',
  standalone: true,
  imports: [TouristMenuComponent, FormsModule, CommonModule],
  templateUrl: './tourist-spec-cottage.component.html',
  styleUrl: './tourist-spec-cottage.component.css'
})
export class TouristSpecCottageComponent implements OnInit{
  ngOnInit(): void {
    // this.id = Number(this.route.snapshot.paramMap.get('id'))


    const url = window.location.href; // full URL, e.g. http://localhost:4200/users/5
    const parts = url.split('/');     // split by "/"
    const idStr = parts[parts.length - 1]; // last part
    this.id = Number(idStr);

    this.cs.getById(this.id).subscribe(data=>{
      // alert(data.koordinate==null)
      this.cottage=data
      this.pics = data.galerija

      // alert(data.koordinate)

      this.lat = Number(data.koordinate.split(', ')[0])
      this.lng = Number(data.koordinate.split(', ')[1])
      const tmp = `https://www.openstreetmap.org/export/embed.html?bbox=${this.lng-0.01}%2C${this.lat-0.01}%2C${this.lng+0.01}%2C${this.lat+0.01}&layer=mapnik&marker=${this.lat}%2C${this.lng}`
      this.srcMap = this.sanit.bypassSecurityTrustResourceUrl(tmp)
      // alert(this.srcMap)
      // alert(this.lat + " " + this.lng)

      if(new Date(this.cottage.blokiranaDo)<= new Date()){
        this.cs.setUnblockedUntil(this.cottage.id).subscribe(data=>{
          // alert(data.message)
        })
      }
    })

    this.us.getAllOwners().subscribe(data=>{
      for(let e of data){
        if(e.korisnicko_ime==this.cottage.vlasnik){
          this.owner = e
        }
      }
    })

    // this.d.setHours/((this.d.getHours()+2)%24)


    let s = localStorage.getItem("logged")
    if(s!=null){
      this.us.getUserByUsername(s).subscribe(data=>
        this.tourist = data
      )
    }

    this.rs.getReservations().subscribe(data=>{
      this.allRes = data
    })

    this.isFirefox = navigator.userAgent.toLowerCase().includes('firefox') || navigator.userAgent.toLowerCase().includes('mozzila')

  }

  lat = 0
  lng = 0

  // d = new Date()

  srcMap!: SafeResourceUrl;

  private sanit = inject(DomSanitizer)
  private route = inject(ActivatedRoute)
  private cs = inject(CottageService)
  private us = inject(UserService)
  private rs = inject(ReservationService)
  private router = inject(Router)

  isFirefox = false
  firefox_time = ""

  id = 0
  cottage: Cottage = new Cottage()
  pics: string[]= []
  ind =0
  selected = ""
  owner: User = new User()
  tourist: User = new User()
  rsvp_step = 0

  allRes: Reservation[]= []


  nextStep() {
    this.ind=(this.ind+1)%this.pics.length
    return this.ind
  }
  prevStep() {
    this.ind=(this.ind-1<0?this.pics.length-1:this.ind-1)%this.pics.length
    return this.ind
  }
  currMonth(){
    return new Date().getMonth()
  }

  imgFile: File | null = null
  err = ""

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

  update() {
    if(this.imgFile==null){
      this.err="Nije unet fajl!"
      return
    } else this.err=""

     this.cs.updateImage(this.id, this.imgFile).subscribe(data=>{
      alert(data)
     })
  }

  delete(){
    if(this.selected!=""){
      this.cs.deleteImage(this.id, this.selected).subscribe(data=>{
        alert(data)
      })
    }
  }


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


  back(){
    this.router.navigate(['../../../tourist/cottages'])
  }

  changePass(){
    this.router.navigate(['../../../updatePassword'])
  }

  logout(){
    localStorage.clear()
    this.router.navigate(['login'])
  }


  getTodayDateTimeLocal(): string {
    const now = new Date();

    const pad = (n: number) => n.toString().padStart(2, '0');

    let hours = now.getHours();
    let minutes = now.getMinutes();

    if (hours < 14) {
      hours = 14;
      minutes = 0
    }

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const paddedHours = pad(hours);
    const paddedMinutes = pad(minutes);
    // alert(`${year}-${month}-${day}T${paddedHours}:${paddedMinutes}`)
    return `${year}-${month}-${day}T${paddedHours}:${paddedMinutes}`;
  }

  deca = 0
  odrasli = 0
  err_step = ""
  today = this.getTodayDateTimeLocal()
  datumVremeOd = this.today
  datumVremeDo = ""

  odustani(){
    this.rsvp_step = 0
  }

  isNumericOnly(str: string): boolean {
    return /^\d+$/.test(str);
  }

  next_rsvp_step(){
    // alert(Number(new Date().toISOString().split('T')[1].split(':')[0]))
    if(this.datumVremeDo==""){
      this.err_step="Nisu izabrani datum i vreme dolaska!"
      return
    } else if(this.datumVremeDo==""){
      this.err_step="Nisu izabrani datum i vreme odlaska!"
      return
    } else if(this.odrasli==0){
      this.err_step="Broj odraslih ne može biti nula!"
      return
    } else if(this.odrasli<0 || this.deca<0){
      this.err_step="Ne možete uneti negativan broj!"
      return
    } else if(!this.isNumericOnly(String(this.odrasli)) || !this.isNumericOnly(String(this.deca))){
      this.err_step="Mogu se uneti isključivo cifre za brojeve posetilaca!"
      return
    }
    // alert(Number(this.datumVremeOd.split('T')[1].split(':')[0]))
    this.err_step=""
    if(Number(this.datumVremeOd.split('T')[1].split(':')[0])<14){
      this.err_step="Vreme dolaska mora biti posle 14h !"
      return
    }
    this.err_step=""
    if(Number(this.datumVremeDo.split('T')[1].split(':')[0])>=10){
      this.err_step="Vreme odlaska mora biti pre 10 sati prepodne!"
      return
    }
    this.err_step=""

    if(this.cottage.broj_osoba<(this.deca+this.odrasli)){
      this.err_step="Suvišan broj osoba!"
      return
    }
    this.err_step=""
    this.rsvp_step = (this.rsvp_step+1)%2
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




  formatDate_err(isoString: string): string {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${day}.${month}.${year}. ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  calculate_price(){
    const startDate = new Date(this.datumVremeOd);
    const endDate = new Date(this.datumVremeDo);

    // Normalize both to midnight for night calculation
    const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    const diffMs = endMidnight.getTime() - startMidnight.getTime();
    let nights =Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (nights < 0) nights = 0;

    if (nights === 0) return 0;

    // Determine price based on month of start date
    const month = startDate.getMonth(); // 0 = Jan, 4 = May, etc.
    const summerMonths = [4, 5, 6, 7]; // May, June, July, August

    const pricePerNight = summerMonths.includes(month) ? this.cottage.letnji_cenovnik : this.cottage.zimski_cenovnik;

    return nights * pricePerNight;
  }


  new_rsvp: Reservation = new Reservation()
  dodatni_zahtevi = ""

  reserve() {
    this.card_check()
    if(this.card_type==0){
      this.err_step2="Proveriti format kartice!"
      return
    }
    this.err_step2=""

    if(this.cottage.blokiranaDo!=""){
      let d = new Date(this.cottage.blokiranaDo)
      this.err_step2="Vikendica je trenutno blokirana!"
      return
    }

    this.err_step2= ""

    this.new_rsvp.id = 0
    this.new_rsvp.turista = this.tourist.korisnicko_ime
    this.new_rsvp.vlasnik = this.cottage.vlasnik
    this.new_rsvp.datum_od = new Date(this.datumVremeOd).toISOString()
    this.new_rsvp.datum_do = new Date(this.datumVremeDo).toISOString()
    this.new_rsvp.odrasli = this.odrasli
    this.new_rsvp.deca = this.deca
    this.new_rsvp.zahtevi = this.dodatni_zahtevi
    this.new_rsvp.status = "neobradjen"
    this.new_rsvp.komentar_turista = ""
    this.new_rsvp.komentar_vlasnik = ""
    this.new_rsvp.timestamp = new Date().toISOString()
    this.new_rsvp.ocena = 0
    this.new_rsvp.cena = this.calculate_price()
    this.new_rsvp.cottName = this.cottage.naziv
    this.new_rsvp.cottPlace = this.cottage.mesto

    //proveriti na strani beka datume za prihvacene rezervacije
    //koje se poklapaju sa datumima, ostale statuse ignorisi
    //mzd je efikasnije da ih ubacujes sortirane
    //ali ima ono .sort..

    this.rs.addReservation(this.new_rsvp).subscribe(data=>{
      // alert(data.message)
      this.err_step2 = data.message
      if(!this.err_step2.startsWith("Vikendica") && !this.err_step2.startsWith("Neuspešno") &&
         !this.err_step2.startsWith("Greška")) {

          this.rsvp_step = (this.rsvp_step+1)%2
          this.deca = 0
          this.odrasli = 0
          this.err_step = data.message
          this.err_step2 = ""
          this.today = this.getTodayDateTimeLocal()
          this.datumVremeOd = this.today
          this.datumVremeDo = ""
        }
      // return
    })
    // this.err_step2=""

    // this.err_step2=""
    // window.location.relo/ad()
    // this.ngOnInit()
  }




  card_type = 0
  diners = false
  visa = false
  master = false
  err_step2 = ""

  card_check(){
    if(this.tourist.broj_kartice.length<15){
      this.err_step2 = "Nedovoljno cifara!"
      this.card_type = 0
    } else if(this.tourist.broj_kartice.length>16) {
      this.err_step2 = "Suviše cifara"
      this.card_type=0
    } else if(this.tourist.broj_kartice.length==15) {
      if(
        this.tourist.broj_kartice.startsWith('300') ||
        this.tourist.broj_kartice.startsWith('301') ||
        this.tourist.broj_kartice.startsWith('302') ||
        this.tourist.broj_kartice.startsWith('303') ||
        this.tourist.broj_kartice.startsWith('36') ||
        this.tourist.broj_kartice.startsWith('38')
      ) {
        this.diners = true
        this.visa = this.master = false
        this.card_type = 1
        this.err_step2 = ""
      } else {
        this.err_step2 = "Pogrešan broj Diners kartice!"
        this.visa=this.diners=this.master=false
        this.card_type=0
      }

    } else if(this.tourist.broj_kartice.length==16) {
      if(
        this.tourist.broj_kartice.startsWith('51') ||
        this.tourist.broj_kartice.startsWith('52') ||
        this.tourist.broj_kartice.startsWith('53') ||
        this.tourist.broj_kartice.startsWith('54') ||
        this.tourist.broj_kartice.startsWith('55')
      ){
        this.master = true
        this.visa = this.diners = false
        this.card_type = 2
        this.err_step2 = ""
      } else if(
        this.tourist.broj_kartice.startsWith('4539') ||
        this.tourist.broj_kartice.startsWith('4556') ||
        this.tourist.broj_kartice.startsWith('4916') ||
        this.tourist.broj_kartice.startsWith('4532') ||
        this.tourist.broj_kartice.startsWith('4929') ||
        this.tourist.broj_kartice.startsWith('4485') ||
        this.tourist.broj_kartice.startsWith('4716')

      ) {
        this.visa = true
        this.master = this.diners = false
        this.card_type = 3
        this.err_step2 = ""
      } else {
        this.err_step2 = "Pogrešan broj kartice!"
        this.visa=this.diners=this.master=false
        this.card_type=0
      }
    }
  }

  find_maxId(){
    let res = 0
    for(let elm of this.allRes){
      res = Math.max(res, elm.id)
    }

    return res+1
  }

  updateCombinedDateTime(s: string) {
    if (this.isFirefox &&  this.firefox_time) {
      return `${s}T${this.firefox_time}`
    }
    return ""
  }

  month_toString(s: string){
    const today = new Date(s)
    switch(today.getMonth()) {
      case 0:
        return "Januar";
      case 1:
        return "Februar";
      case 2:
        return "Mart";
      case 3:
        return "April";
      case 4:
        return "Maj";
      case 5:
        return "Jun";
      case 6:
        return "Jul";
      case 7:
        return "Avgust";
      case 8:
        return "Septembar";
      case 9:
        return "Oktobar";
      case 10:
        return "Novembar";
      case 11:
        return "Decembar";
      default:
        return "Nepoznat mesec";
    }
  }
}
