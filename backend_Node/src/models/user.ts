import mongoose from "mongoose";

let user = new mongoose.Schema({
    korisnicko_ime: String,
    lozinka: String,
    ime: String,
    prezime: String,
    pol: String,
    adresa: String,
    telefon: String,
    email: String,
    profilna: String,
    broj_kartice: String,
    tip: String, //turista,vlasnik, admin
    status: String //neregistrovan, odbijen, aktiviran, deaktiviran
    // neregistrovan - pending
    // aktiviran - ide u bazu
    // deaktiviran - u bazi, ali bez pristupa
    // odbijen - podaci nmg za registraciju vise da se koriste
},{
    versionKey: false
})

export default mongoose.model('UserModel', user, 'korisnici')