import express from 'express'
import UserModel from '../models/user'
import { sha3_512 } from 'js-sha3'
import multer from 'multer'
import path from 'path'
import fs from 'fs';


// import { Console, error } from 'console';

const imgStorage = multer.diskStorage({
    destination: './profileImages',
    filename:(req, file, callback) =>{
        callback(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: imgStorage,
    fileFilter(req, file, callback) {
        const ftypes = /(jpeg)|(jpg)|(png)/;
        const extname = ftypes.test(path.extname(file.originalname).toLowerCase())
        if (extname) {
            return callback(null, true)
        } else {
            callback(new Error("Dozvoljeni formati su JPG i PNG"))
        }
    },
}).single('profilna')


export class UserController {

    login = (req: express.Request, res: express.Response) => {
        let u = req.body.korisnicko_ime
        let p = sha3_512(req.body.lozinka)
        // let p = req.body.lozinka

        UserModel.findOne({korisnicko_ime: u, lozinka: p}).then((user)=>{
            res.status(200)
            res.json(user)
        }).catch((err)=>{
            res.status(400)
            console.log(err)
            res.json(null)
        })
    }

    getAllOwners = (req: express.Request, res: express.Response) => {
    
        UserModel.find({tip:"vlasnik"}).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }
    
    getAllTourists = (req: express.Request, res: express.Response) => {
    
        UserModel.find({tip:"turista"}).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }

    registerUser = (req: express.Request, res: express.Response) => {
        let u = new UserModel(req.body.user)
        
        u.lozinka = sha3_512(u.lozinka as string)

        UserModel.findOne({korisnicko_ime: req.body.user.korisnicko_ime}).then((tmp)=>{
            // let email_check = false
            
            if(tmp){
                if(tmp.status=="odbijen" || tmp.status=="aktiviran" || tmp.status=="neregistrovan"){
                    res.json({message: "Došlo je do greške kod korisničkog imena!"})
                }
                return
            }

            UserModel.findOne({email:u.email}).then((tmp2)=>{
                if(tmp2){
                    return res.json({message: "Došlo je do greške kod e-mail-a"})
                }

                u.save().then((ok)=>{
                res.json({message:"Uspešna registracija!"})
                }).catch((err)=>{
                    console.log(err)
                    res.json({message:"Neuspešna registracija!"})
                })
            
            }).catch((err)=>{
                console.log(err)
                res.json({message:"Neuspešna registracija!"})
            })  

            // if(email_check) {
            //     res.json({message: "Došlo je do greške kod e-mail-a"})
                       
            //     return
            // }

            
        })

       
    }

    getUserByUsername = (req: express.Request, res: express.Response) => {
    
        UserModel.findOne({korisnicko_ime:req.body.korisnicko_ime}).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }

    getUserByEmail= (req: express.Request, res: express.Response) => {
    
        UserModel.findOne({email: req.body.email}).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }

    //updates

    deleteUser = (req: express.Request, res: express.Response) => {
    
        UserModel.findOneAndDelete({korisnicko_ime: req.body.korisnicko_ime}).then((all)=>{
            
            if(all!=null) return res.json({message: "Uspešno brisanje korisnika!"})
            else return res.json({message: "Korisnik ne postoji!"})
        
            }).catch(err=>{
            console.log(err)
            res.json({message: "Neuspešno brisanje korisnika!"})
        })
    }

    deactivateUser = (req: express.Request, res: express.Response) => {
    
        UserModel.findOne({korisnicko_ime: req.body.korisnicko_ime}).then((user)=>{
            if(user==null){
                res.json({message:"Ovakav korinsnik ne postoji!"})
                return
            }
            if(user.status=="deaktiviran"){
                res.json({message:"Korisnik je već deaktiviran!"})
                return
            }
            else if(user.status=="odbijen"){
                res.json({message:"Korisnik je odbijen!"})
                return
            }
            else if(user.status=="neregistrovan"){
                res.json({message:"Obradi prvo zahtev za registraciju korisnika!"})
                return
            }

            UserModel.updateOne({korisnicko_ime: req.body.korisnicko_ime},
                {$set: {status:"deaktiviran"}}
            ).then((ok)=>{
                res.json({message: "Uspešno deaktiviranje korisnika!"})
            }).catch((err)=>{
                console.log(err)
                res.json({message: "Neuspešno deaktiviranje korisnika!"})
        
            })
        })

        // UserModel.findOneAndUpdate(
        //     {korisnicko_ime: req.body.korime, status:{$in: ['aktiviran', 'neregistrovan']}}, 
        //     {$set: {status:"deaktiviran"}}).then((all)=>{
        //     res.json({message: "Uspešno brisanje korisnika!"})
        // }).catch(err=>{
        //     console.log(err)
        //     res.json({message: "Neuspešno ažuriranje slike!"})
        // })
    }

    activateUser = (req: express.Request, res: express.Response) => {
    
        UserModel.findOne({korisnicko_ime: req.body.korisnicko_ime}).then((user)=>{
            if(user==null){
                res.json({message:"Ovakav korinsnik ne postoji!"})
                return
            }
            if(user.status=="aktiviran"){
                res.json({message:"Korisnik je već aktiviran!"})
                return
            }
            else if(user.status=="odbijen"){
                res.json({message:"Korisnik je odbijen!"})
                return
            }
            else if(user.status=="neregistrovan"){
                res.json({message:"Obradi prvo zahtev za registraciju korisnika!"})
                return
            }

            UserModel.updateOne({korisnicko_ime: req.body.korisnicko_ime},
                {$set: {status:"aktiviran"}}
            ).then((ok)=>{
                res.json({message: "Uspešno aktiviranje korisnika!"})
            }).catch((err)=>{
                console.log(err)
                res.json({message: "Neuspešno aktiviranje korisnika!"})
        
            })
        })

    }

    acceptUser  = (req: express.Request, res: express.Response) => {
    
        UserModel.findOne({korisnicko_ime: req.body.korisnicko_ime}).then((user)=>{
            if(user==null){
                res.json({message:"Ovakav korinsnik ne postoji!"})
                return
            }
            if(user.status=="deaktiviran"){
                res.json({message:"Korisnik je deaktiviran!"})
                return
            }
            else if(user.status=="odbijen"){
                res.json({message:"Korisnik je odbijen!"})
                return
            }
            else if(user.status=="aktiviran"){
                res.json({message:"Korisnik je već prihvaćen!"})
                return
            }

            UserModel.updateOne({korisnicko_ime: req.body.korisnicko_ime, status:'neregistrovan'},
                {$set: {status:"aktiviran"}}
            ).then((ok)=>{
                res.json({message: "Uspešno prihvatanje korisnika!"})
            }).catch((err)=>{
                console.log(err)
                res.json({message: "Neuspešno prihvatanje korisnika!"})
        
            })
        })

    }

    denyUser  = (req: express.Request, res: express.Response) => {
    
        UserModel.findOne({korisnicko_ime: req.body.korisnicko_ime}).then((user)=>{
            if(user==null){
                res.json({message:"Ovakav korinsnik ne postoji!"})
                return
            }
            if(user.status=="deaktiviran"){
                res.json({message:"Korisnik je deaktiviran!"})
                return
            }
            else if(user.status=="odbijen"){
                res.json({message:"Korisnik je već odbijen!"})
                return
            } else if(user.status=="aktiviran"){
                res.json({message:"Korisnik je već ranije prihvaćen, moguće je deaktivirati ga!"})
                return
            }
            

            UserModel.updateOne({korisnicko_ime: req.body.korisnicko_ime, status:'neregistrovan'},
                {$set: {status:"odbijen"}}
            ).then((ok)=>{
                res.json({message: "Uspešno odbijanje korisnika!"})
            }).catch((err)=>{
                console.log(err)
                res.json({message: "Neuspešno odbijanje korisnika!"})
        
            })
        })

    }


    changeImage = (req: express.Request, res: express.Response) => {
        
        upload(req,res,error => {
            if(error) {
                res.json({message: "Greška pri dodavanju slike!"})
            } else {
                let imgPath = req.file?.path

                console.log(imgPath)

                let korime = req.body.korisnicko_ime

                UserModel.findOneAndUpdate({korisnicko_ime: korime}, {profilna: imgPath}).then((user)=>{
                    res.json({message: "Uspešno ažuriranje slike!"})
                }).catch((err)=>{
                    res.json({message:"Greška pri ažuriranju slike!"})
                    console.log(err)
                })
            }
        })

    }


    updatePassword = (req: express.Request, res: express.Response) => {
        
        let loz = sha3_512(req.body.lozinka)

        UserModel.findOneAndUpdate(
                {korisnicko_ime: req.body.korisnicko_ime},
                {$set: {lozinka: loz}}).then((user)=>{
            
            res.json({message: "Uspešno ažuriranje lozinke!"})
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Neuspešno ažuriranje lozinke!"})
        })
    }

    updateFirstname = (req: express.Request, res: express.Response) => {
        
        UserModel.findOneAndUpdate(
                {korisnicko_ime: req.body.korisnicko_ime},
                {$set: {ime: req.body.ime}}).then((user)=>{
            
            res.json({message: "Uspešno ažuriranje imena!"})
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Neuspešno ažuriranje imena!"})
        })
    }
    updateLastname = (req: express.Request, res: express.Response) => {
        
        UserModel.findOneAndUpdate(
                {korisnicko_ime: req.body.korisnicko_ime},
                {$set: {prezime: req.body.prezime}}).then((user)=>{
            
            res.json({message: "Uspešno ažuriranje prezimena!"})
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Neuspešno ažuriranje prezimena!"})
        })
    }
    updateAddress = (req: express.Request, res: express.Response) => {
        
        UserModel.findOneAndUpdate(
                {korisnicko_ime: req.body.korisnicko_ime},
                {$set: {adresa: req.body.adresa}}).then((user)=>{
            
            res.json({message: "Uspešno ažuriranje adrese!"})
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Neuspešno ažuriranje adrese!"})
        })
    }
    updatePhoneNumber = (req: express.Request, res: express.Response) => {
        
        UserModel.findOneAndUpdate(
                {korisnicko_ime: req.body.korisnicko_ime},
                {$set: {telefon: req.body.telefon}}).then((user)=>{
            
            res.json({message: "Uspešno ažuriranje kontakt telefona!"})
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Neuspešno ažuriranje kontakt telefona!"})
        })
    }
    updateEmail = (req: express.Request, res: express.Response) => {
        
        UserModel.findOneAndUpdate(
                {korisnicko_ime: req.body.korisnicko_ime},
                {$set: {email: req.body.email}}).then((user)=>{
            
            res.json({message: "Uspešno ažuriranje e-mail-a!"})
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Neuspešno ažuriranje e-mail-a!"})
        })
    }
    updateCardNumber = (req: express.Request, res: express.Response) => {
        
        UserModel.findOneAndUpdate(
                {korisnicko_ime: req.body.korisnicko_ime},
                {$set: {broj_kartice: req.body.broj_kartice}}).then((user)=>{
            
            res.json({message: "Uspešno ažuriranje broja kartice!"})
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Neuspešno ažuriranje broja kartice!"})
        })
    }


    deleteImage = (req: express.Request, res: express.Response) => {
        const korime = req.body.korisnicko_ime;
        if (!korime) {
            res.json({ message: "Nedostaje korisničko ime!" });
            return;
        }

        const defpic = "profileImages/def_profile.png"

        UserModel.findOne(
            {korisnicko_ime: korime}
        ).then((user)=>{
            if (!user) {
                res.json({ message: "Korisnik nije pronađen!" });
                return
            }

            const currpic = user.profilna

            if(currpic && currpic != defpic){
                const filePath = path.resolve(currpic)
                fs.unlink(filePath, err=>{
                    if(err) console.log("Greška pri brisanju fajla:", err);
                })
            }

            UserModel.findOneAndUpdate(
                {korisnicko_ime: korime},
                {profilna: defpic},
                {new: true}
            ).then(updatedUser => {
                res.json({ message: "Profilna slika zamenjena default slikom!", user: updatedUser });
            }).catch(err => {
                console.log(err);
                res.json({ message: "Greška pri ažuriranju default slike!" });
            });
        }).catch(err => {
            console.log(err);
            res.json({ message: "Greška pri pronalaženju korisnika!" });
        });

    }
}