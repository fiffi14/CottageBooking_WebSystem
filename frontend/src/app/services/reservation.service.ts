import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Reservation } from '../models/reservation';
import { Message } from '../models/message';
import { timestamp } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient)
  private url = "http://localhost:4000/reservation"
  constructor() { }

  getReservations() {
    return this.http.get<Reservation[]>(`${this.url}/allReservations`)
  }

  addReservation(r: Reservation){
    return this.http.post<Message>(`${this.url}/addReservation`, r)
  }

  getResByTourist(t: string){
    return this.http.post<Reservation[]>(`${this.url}/reservationsByTourist`, {tourist: t})
  }

  cancelRes(t: string, ts: string){
    return this.http.post<Message>(`${this.url}/cancelReservation`, {tourist: t, timestamp: ts})
  }

  review(t: string, ts: string, comm: string, g:number){
    return this.http.post<Message>(`${this.url}/review`,
       {tourist: t, timestamp: ts, comment: comm, grade: g})

  }

  resByOwnerSorted(t: string){
    return this.http.post<Reservation[]>(`${this.url}/resByOwnerSorted`, {owner: t})
  }

  resByOwner(t: string){
    return this.http.post<Reservation[]>(`${this.url}/reservationsByOwner`, {vlasnik: t})
  }

  denyRes(id: number, comm: string){
    return this.http.post<Message>(`${this.url}/deniedReservation`, {id: id, komentar: comm})
  }



  accRes(id: number, comm: string){
    return this.http.post<Message>(`${this.url}/acceptedReservation`, {id: id, komentar: comm, status: "prihvacena"})
  }

  delRes(n: string, v: string){
    return this.http.post<Message>(`${this.url}/deleteRes`, {naziv: n, vlasnik: v})

  }

  autoDenyRes_owner(){
    return this.http.post<Message>(`${this.url}/autoDeny`, {})

  }

  resBy_owner_place_name(v: string, n: string, m: string){
    return this.http.post<Reservation[]>(`${this.url}/res_owner_place_name`,
      {vlasnik: v, naziv: n, mesto: m})

  }


}
