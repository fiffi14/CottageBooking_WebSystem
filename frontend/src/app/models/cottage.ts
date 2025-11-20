import { Note } from "./note"

export class Cottage{
  id = 0
  vlasnik = ""
  naziv = ""
  mesto= ""
  broj_osoba = 0
  kvadratura = 0
  usluge= ""
  letnji_cenovnik= 0
  zimski_cenovnik= 0
  telefon= ""
  koordinate= ""
  galerija: Array<string> = []
  lista_ocena: Array<Note> = []
  blokiranaDo = ""
}
