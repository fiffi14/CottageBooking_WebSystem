import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cottage } from '../models/cottage';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class CottageService {
  private url = "http://localhost:4000/cottage"
  private http = inject(HttpClient)

  constructor() { }

  getAllCottages() {
    return this.http.get<Cottage[]>(`${this.url}/allCottages`)
  }

  searchByName(n: string){
    return this.http.post<Cottage[]>(`${this.url}/searchByName`, {naziv: n})
  }

  searchByNamePlace(n: string, m: string){
    return this.http.post<Cottage[]>(`${this.url}/searchByNamePlace`, {naziv: n, mesto: m})
  }

  searchByPlace(n: string){
    return this.http.post<Cottage[]>(`${this.url}/searchByPlace`, {mesto: n})
  }

  setBlockedUntil(id_: number,d: string){
    return this.http.post<Message>(`${this.url}/blockCottage`, {id:id_, datum: d})
  }

  setUnblockedUntil(id_: number){
    return this.http.post<Message>(`${this.url}/unblockCottage`, {id:id_})
  }

  updateImage(id: number, slika: File){
    const formData = new FormData()
    formData.append("id", String(id))
    formData.append("galerija", slika)

    return this.http.post<Message>(`${this.url}/addToGallery`, formData)
  }

  updateMultipleImages(id: number, slike: File[]){
    const formData = new FormData()
    formData.append('id', String(id));

    for (const s of slike) {
      formData.append('galerija', s); // backend handles array of 'galerija'
    }
    return this.http.post<Message>(`${this.url}/addToGallery`, formData)
  }



  deleteImage(id: number, imgPath: string){
    return this.http.post<Message>(`${this.url}/removeFromGallery`, {
      idvik: id,
      imgPath: imgPath
    });
  }

  getById(i: number){
    return this.http.post<Cottage>(`${this.url}/getById`, {id:i})
  }

  add_review(v: string, n: string, m:string, o:number, kom: string, tur: string){
    return this.http.post<Message>(`${this.url}/push_lista_ocena`,
      {vlasnik:v, naziv:n, mesto:m, ocena: o, komentar: kom, turista:tur}
    )
  }

  automaticUnblockCottages(){
    return this.http.post<Message>(`${this.url}/automaticUnblock`, {})
  }


  getCottagesByOwner(i: string){
    return this.http.post<Cottage[]>(`${this.url}/getOwnerCottages`, {owner:i})
  }

  updateNaziv(id:number, n: string){
    return this.http.post<Message>(`${this.url}/setNaziv`, {id: id, naziv: n})
  }


  updateMesto(id:number, n: string){
    return this.http.post<Message>(`${this.url}/setMesto`, {id: id, mesto: n})
  }
  updateUsluge(id:number, n: string){
    return this.http.post<Message>(`${this.url}/setUsluge`, {id: id, usluge: n})
  }
  updateTelefon(id:number, n: string){
    return this.http.post<Message>(`${this.url}/setTelefon`, {id: id, telefon: n})
  }
  updateBrojOsoba(id:number, n: number){
    return this.http.post<Message>(`${this.url}/setBrojOsoba`, {id: id, broj_osoba: n})
  }
  updateKvadratura(id:number, n: number){
    return this.http.post<Message>(`${this.url}/setKvadratura`, {id: id, kvadratura: n})
  }
  updateLetnji(id:number, n: number){
    return this.http.post<Message>(`${this.url}/setLetnjiCenovnik`, {id: id, letnji: n})
  }
  updateZimski(id:number, n: number){
    return this.http.post<Message>(`${this.url}/setZimskiCenovnik`, {id: id, zimski: n})
  }
  updateKoordinate(id:number, n: string){
    return this.http.post<Message>(`${this.url}/setKoordinate`, {id: id, koordinate: n})
  }

  deleteCottage(id:number){
    return this.http.post<Message>(`${this.url}/deleteCottage`, {id: id})

  }

  regCottage(c: Cottage){
    return this.http.post<Message>(`${this.url}/registerCottage`, {cott: c})

  }

}
