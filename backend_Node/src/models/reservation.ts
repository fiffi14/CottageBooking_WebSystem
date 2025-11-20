import mongoose from "mongoose";


let r = new mongoose.Schema({
    id: Number,
    turista: String,
    vlasnik: String,
    datum_od: String,
    datum_do: String,
    odrasli: Number,
    deca: Number,
    zahtevi: String,
    status: String, //neobradjen, odbijen, prihvacen
    komentar_turista: String,
    komentar_vlasnik: String,
    ocena: Number,
    timestamp: String,
    cena: Number,
    cottName: String,
    cottPlace: String
}, {
    versionKey: false
})

export default mongoose.model('ReservationModel', r, 'rezervacije')