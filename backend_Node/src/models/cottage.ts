// import { Double } from "mongodb";
import mongoose from "mongoose";

let cottage = new mongoose.Schema({
    id: Number,
    vlasnik: String,
    naziv: String,
    mesto: String,
    broj_osoba: Number,
    kvadratura: Number,
    usluge: String,
    letnji_cenovnik: Number,
    zimski_cenovnik: Number,
    telefon: String,
    koordinate: String,
    galerija: Array,
    lista_ocena: Array,
    blokiranaDo: String
},{
    versionKey: false
})

export default mongoose.model('CottageModel', cottage, 'vikendice')