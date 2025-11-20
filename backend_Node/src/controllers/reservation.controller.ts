import express from 'express'
import ReservationModel from '../models/reservation'

export class ReservationController{
    
    getReservations = (req: express.Request, res: express.Response) => {
        
        ReservationModel.find({}).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }

    addReservation = (req: express.Request, res: express.Response) => {
        let rsvp = req.body;

        ReservationModel.find().then((all)=>{
            let id;
            let existingIds: number[] = []
            for(let e of all){
                existingIds.push(e.id)
            }

            do {
                id = Math.floor(100000 + Math.random() * 900000); // always 6 digits
            } while (existingIds.includes(id));

            rsvp.id = id
            
            // Convert incoming ISO strings to Date objects for comparison
            let start = new Date(rsvp.datum_od);
            let end = new Date(rsvp.datum_do);

            if (end <= start) {
                res.json({ message: "Datum i vreme odlaska mora biti posle dolaska!" });
                return;
            }

            ReservationModel.find({
                cottName: rsvp.cottName,
                vlasnik: rsvp.vlasnik,
                status: "prihvacena"
            }).then(allAccepted => {
                const overlapping = allAccepted.some(existing => {
                    const existingStart = new Date(existing?.datum_od || 0);
                    const existingEnd = new Date(existing?.datum_do || 0);
                    return existingStart < end && existingEnd > start;
                });


                if (overlapping) {
                    res.json({ message: "Vikendica je već bukirana tokom datog perioda!" });
                    return;
                }

                let new_rsvp = new ReservationModel(rsvp);

                new_rsvp.save()
                    .then(() => {
                        res.json({ message: "Uspešno kreiranje rezervacije" });
                    })
                    .catch(err => {
                        console.log(err);
                        res.json({ message: "Neuspešno kreiranje rezervacije" });
                    });
            })


        
        }).catch(err => {
            console.log(err);
                res.json({ message: "Greška pri pristupu bazi podataka!" });
        });
    };


    getReservationsByTourist = (req: express.Request, res: express.Response) => {
        
        ReservationModel.find({turista: req.body.tourist}).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }

    cancel = (req: express.Request, res: express.Response) => {
        
        ReservationModel.deleteOne({turista: req.body.tourist, timestamp: req.body.timestamp}).then((all)=>{
            res.json({ message: "Uspešno otkazivanje rezervacije" })
        }).catch(err=>{
            console.log(err)
            res.json({ message: "Neuspešno otkazivanje rezervacije" })
        })
    }

    setCommentGrade = (req: express.Request, res: express.Response) => {
        
        ReservationModel.findOneAndUpdate(
            {turista: req.body.tourist, timestamp: req.body.timestamp},
            {$set: {komentar_turista: req.body.comment, ocena: req.body.grade}}
        ).then((all)=>{
            res.json({ message: "Uspešna recenzija!" })
        }).catch(err=>{
            console.log(err)
            res.json({ message: "Neuspešna recenzija!" })
        })
    }

    getReservationsByOwnerSorted = (req: express.Request, res: express.Response) => {
        
        ReservationModel.find({vlasnik: req.body.owner}).sort({datum_od: 1, timestamp: -1}).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }

    denyRes = (req: express.Request, res: express.Response) => {
        
        ReservationModel.findOneAndUpdate(
            {id: req.body.id},
            {$set: {komentar_vlasnik: req.body.komentar, status: "odbijena"}}
        ).then((all)=>{
            res.json({ message: "Uspešno odbijanje statusa!" })
        }).catch(err=>{
            console.log(err)
            res.json({ message: "Uspešno odbijanje statusa!" })
        })
    }

    setStatusToAccepted = (req: express.Request, res: express.Response) => {
    // const { id, komentar, status } = req.body;

    // First, find the reservation to be accepted
        ReservationModel.findOne(
            {id: req.body.id}
        ).then(accepted => {
            if (!accepted) {
                res.status(404).json({ message: "Rezervacija nije pronađena!" });
                return;
            }

            if (req.body.status !== "prihvacena") {
                res.status(400).json({ message: "Status mora biti 'prihvacena' za ovaj endpoint." });
                return;
            }

            const acceptedStart = new Date(accepted?.datum_od || 0).getTime();
            const acceptedEnd = new Date(accepted?.datum_do || 0).getTime();

            // 2️ Find all pending reservations for the same cottage
            ReservationModel.find({
                _id: { $ne: accepted._id },
                cottName: accepted.cottName,
                status: "neobradjen"
            })
            .then(pendingReservations => {

                let index = 0;

                const processNext = () => {
                    if (index >= pendingReservations.length) {
                        // 4️ After checking all, accept the reservation
                        accepted.status = "prihvacena";
                        accepted.komentar_vlasnik = req.body.komentar;

                        accepted.save()
                            .then(() => {
                                res.json({ message: "Rezervacija prihvaćena i svi preklapajući pending odbijeni!" });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({ message: "Greška pri čuvanju prihvaćene rezervacije!" });
                            });
                        return;
                    }

                    const existing = pendingReservations[index];
                    const existingStart = new Date(existing?.datum_od || 0).getTime();
                    const existingEnd = new Date(existing?.datum_do || 0).getTime();

                    // 3️ 3 Check for overlap
                    if ((acceptedStart < existingEnd && acceptedStart > existingStart) ||
                        (acceptedEnd > existingStart && acceptedEnd < existingEnd) ||
                        (acceptedStart <= existingStart && acceptedEnd >= existingEnd)) {

                        existing.status = "odbijena";
                        existing.komentar_vlasnik = "Odbijena zbog preklapanja datuma.";

                        existing.save()
                            .then(() => {
                                index++;
                                processNext(); // continue to next pending reservation
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({ message: "Greška pri odbijanju preklapajuće rezervacije!" });
                            });
                    } else {
                        index++;
                        processNext(); // no overlap, continue
                    }
                };

                processNext(); // start processing pending reservations

            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: "Greška pri pristupu pending rezervacijama!" });
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Greška pri pristupu rezervaciji!" });
        });
    }


    deleteReservations = (req: express.Request, res: express.Response) => {
        
        ReservationModel.deleteMany(
            {cottName: req.body.naziv, vlasnik: req.body.vlasnik}

        ).then((all)=>{
            res.json({ message: `Uspešno brisanje rezervacija za vikendicu ${req.body.naziv}!` })
        }).catch(err=>{
            console.log(err)
            res.json({ message:  `Neuspešno brisanje rezervacija za vikendicu ${req.body.naziv}!` })
        })
    }

    autoDenyPastReservations = (req: express.Request, res: express.Response) => {
        const today = new Date();

        ReservationModel.find(
            {}
            ).then(allReservations => {

            const outdated = allReservations.filter(r =>
                new Date(r?.datum_od || 0) < today && r.status === "neobradjen"
            );

            if (outdated.length == 0) {
                res.json({ message: "Nema rezervacija kojima je datum dolaska prošao." });
                return;
            }

            let counter = 0;

            outdated.forEach(r => {
                ReservationModel.findOneAndUpdate(
                { id: r.id },
                {
                    $set: {
                    status: "odbijena",
                    komentar_vlasnik: "Nije obrađen zahtev pre datuma dolaska."
                    }
                }
                ).then(() => {
                    counter++;
                    // Send response after last update finishes
                    if (counter === outdated.length) {
                        res.json({ message: `Ažurirano ${counter} rezervacija.` });
                    }
                }).catch(err => {
                    console.log(`Greška pri ažuriranju rezervacije ${r.id}:`, err);
                });
            });
            }).catch(err => {
                console.log(err);
                res.json({ message: "Greška pri pristupu bazi podataka!" });
        });
    };

    getReservationsByOwner = (req: express.Request, res: express.Response) => {
        
        ReservationModel.find({vlasnik: req.body.vlasnik}).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }

    getReservationsBy_OwnerNamePlace = (req: express.Request, res: express.Response) => {
        
        ReservationModel.find(
            {vlasnik: req.body.vlasnik, cottName: req.body.naziv, cottPlace: req.body.mesto}
        ).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }

    deleteOdbijena  = (req: express.Request, res: express.Response) => {
        
        ReservationModel.deleteMany(
            {status:"odbijena"}

        ).then((all)=>{
            res.json({ message: `Uspešno brisanje odbijenih rezervacija!` })
        }).catch(err=>{
            console.log(err)
            res.json({ message:  `Neuspešno brisanje odbijenih rezervacija!` })
        })
    }
}