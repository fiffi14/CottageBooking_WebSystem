import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = "http://localhost:4000/user"
  private http = inject(HttpClient)
  constructor() { }

  login(u: string, p: string){
    const data = {
      korisnicko_ime: u,
      lozinka: p
    }

    return this.http.post<User>(`${this.url}/login`, data)
  }

  getAllOwners() {
    return this.http.get<User[]>(`${this.url}/allOwners`)
  }


  getAllTourists() {
    return this.http.get<User[]>(`${this.url}/allTourists`)
  }

  getUserByUsername(k: string) {
    return this.http.post<User>(`${this.url}/userByUsername`, {korisnicko_ime: k})
  }

  getUserByMail(e: string){
    return this.http.post<User>(`${this.url}/userByMail`, {email: e})
  }

  registerUser(k: User){
    const u = {
      user: k
    }

    return this.http.post<Message>(`${this.url}/registerUser`, u)
  }

  updateImage(korisnicko_ime: string, profilna: File){
    const formData = new FormData()
    formData.append("korisnicko_ime", korisnicko_ime)
    formData.append("profilna", profilna)

    return this.http.post<Message>(`${this.url}/updateImage`, formData)
  }

  updatePassword(k:string, p: string){
    return this.http.post<Message>(`${this.url}/updatePassword`, {korisnicko_ime: k, lozinka: p})
  }

  updateFirstname(k: string, f: string){
    return this.http.post<Message>(`${this.url}/updateFirstname`, {korisnicko_ime: k, ime: f})

  }

  updateLastname(k: string, f: string){
    return this.http.post<Message>(`${this.url}/updateLastname`, {korisnicko_ime: k, prezime: f})

  }

  updateAddress(k: string, f: string){
    return this.http.post<Message>(`${this.url}/updateAddress`, {korisnicko_ime: k, adresa: f})

  }

  updatePhoneNumber(k: string, f: string){
    return this.http.post<Message>(`${this.url}/updatePhoneNumber`, {korisnicko_ime: k, telefon: f})

  }

  updateEmail(k: string, f: string){
    return this.http.post<Message>(`${this.url}/updateEmail`, {korisnicko_ime: k, email: f})

  }

  updateCardNumber(k: string, f: string){
    return this.http.post<Message>(`${this.url}/updateCardNumber`, {korisnicko_ime: k, broj_kartice: f})

  }

  deleteUser(k: string){
    return this.http.post<Message>(`${this.url}/deleteUser`, {korisnicko_ime: k})

  }

  deactivateUser(k: string){
    return this.http.post<Message>(`${this.url}/deactivateUser`, {korisnicko_ime: k})

  }

  activateUser(k: string){
    return this.http.post<Message>(`${this.url}/activateUser`, {korisnicko_ime: k})

  }

  denyUser(k: string){
    return this.http.post<Message>(`${this.url}/denyUser`, {korisnicko_ime: k})

  }

  acceptUser(k: string){
    return this.http.post<Message>(`${this.url}/acceptUser`, {korisnicko_ime: k})

  }



  deleteProfilna(k: string){
    return this.http.post<Message>(`${this.url}/deleteProfilePic`, {korisnicko_ime: k})

  }

}
