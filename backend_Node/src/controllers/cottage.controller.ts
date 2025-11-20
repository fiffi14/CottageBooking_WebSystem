import multer from 'multer';
import CottageModel from '../models/cottage'
import express from 'express'
import path from 'path';
import fs from 'fs';

import { Console, error } from 'console';

const imgStorage = multer.diskStorage({
    destination: './galleryImages',
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
}).array('galerija',10)



export class CottageController {

    changeImage = (req: express.Request, res: express.Response) => {
        
        upload(req,res,error=>{
            if(error) {
                res.json({message: "Greška pri dodavanju slike u galeriju!"})
            } else {
                const files = req.files as Express.Multer.File[];
                
                 if (!files || files.length === 0) {
                    return res.json({ message: "Nijedna slika nije poslata!" });
                }

                let imgPaths = files.map(f => f.path);

                console.log(imgPaths)

                let idvik = req.body.id

                CottageModel.findOneAndUpdate(
                    {id: idvik}, 
                    {$push: {galerija : {$each:imgPaths}}}).then((user)=>{
                    res.json({message: "Uspešno dodavanje slike u galeriju!"})
                }).catch((err)=>{
                    res.json({message:"Greška pri dodavanju slike!"})
                    console.log(err)
                })
            }
        })
            
    }

    deleteImage = (req: express.Request, res: express.Response) => {
        
        if(!req.body.imgPath || !req.body.idvik){
            res.json({message:"Nedostaju podaci za brisanje slike iz galerije!"})
            return
        }
        CottageModel.findOneAndUpdate(
            {id: req.body.idvik},
            {$pull: {galerija: req.body.imgPath}}
        ).then((user)=>{
            const filePath = path.resolve(req.body.imgPath);
            fs.unlink(filePath, (err) => {
                if (err) {
                    res.json({message: "Greška pri brisanju fajla"})
                    console.log("Greška pri brisanju fajla:", err);
                    // not fatal: file may already be gone
                }
            });
            res.json({message: "Uspešno brisanje slike iz galerije!"})
        }).catch((err)=>{
            console.log(err)
            res.json({message:"Neuspešno brisanje slike iz galerije!"})
        })
            
    }
    

    getAllCottages = (req: express.Request, res: express.Response) => {

        CottageModel.find({}).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }   


    getById = (req: express.Request, res: express.Response) => {

        CottageModel.findOne({id: req.body.id}).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }   

    getByOwner = (req: express.Request, res: express.Response) => {

        CottageModel.find({vlasnik: req.body.owner}).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }   

    searchByName = (req: express.Request, res: express.Response) => {

        CottageModel.find({naziv: {$regex : req.body.naziv, $options: 'i'}}).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }   
    searchByNamePlace = (req: express.Request, res: express.Response) => {

        CottageModel.find({
            naziv: {$regex: req.body.naziv, $options: 'i'},
            mesto :{$regex: req.body.mesto, $options: 'i'}
        }).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }   
    searchByPlace = (req: express.Request, res: express.Response) => {

        CottageModel.find({mesto: {$regex: req.body.mesto, $options: 'i'}}).then((all)=>{
            res.json(all)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }  
    
    setBlockedUntil = (req: express.Request, res: express.Response) => {

        CottageModel.findOneAndUpdate(
            {id: req.body.id}, {$set : {blokiranaDo: req.body.datum}}).then((all)=>{
            res.json({message: "Uspešno blokiranje vikendice!"})
        }).catch(err=>{
            console.log(err)
            res.json({message: "Neuspešno blokiranje vikendice!"})
        })
    }  

    setUnblockedUntil = (req: express.Request, res: express.Response) => {

        CottageModel.findOneAndUpdate(
            {id: req.body.id}, {$set : {blokiranaDo: ""}}).then((all)=>{
            res.json({message: "Uspešno deblokiranje vikendice!"})
        }).catch(err=>{
            console.log(err)
            res.json({message: "Neuspešno deblokiranje vikendice!"})
        })
    }  

    addTo_lista_ocena = (req: express.Request, res: express.Response) => {

        let obj = {
            ocena: req.body.ocena,
            datum: new Date().toISOString(),
            komentar: req.body.komentar,
            korisnik: req.body.turista
        }

        CottageModel.findOneAndUpdate(
            {vlasnik: req.body.vlasnik, naziv: req.body.naziv, mesto: req.body.mesto}, 
            {$push : {lista_ocena: obj}}
        ).then((all)=>{
            res.json({message: "Uspešno dodavanje recencije za vikendicu!"})
        }).catch(err=>{
            console.log(err)
            res.json({message: "Neuspešno dodavanje recencije za vikendicu!"})
        })
    }  
     

    automaticBlokiranaDo_update = (req: express.Request, res: express.Response) => {
        const now = new Date();

        CottageModel.find().then((cottages) => {
            if (!cottages || cottages.length === 0) {
                res.json({ message: "Nema vikendica u bazi." });
                return;
            }

            // Iterate through each cottage
            let updatedCount = 0;

            cottages.forEach((cottage, index) => {
                if (cottage.blokiranaDo) {
                    const blokiranaDoDate = new Date(cottage.blokiranaDo);
                    if (blokiranaDoDate <= now) {
                        // Date has passed → unblock it
                        CottageModel.findOneAndUpdate(
                            { id: cottage.id },
                            { $set: { blokiranaDo: "" } }
                        ).then(() => {
                            updatedCount++;
                            // If last element, send response
                            if (index === cottages.length - 1) {
                                res.json({ message: `Deblokirano ${updatedCount} vikendica.` });
                            }
                        }).catch((err) => {
                            console.log("Greška pri ažuriranju:", err);
                            if (index === cottages.length - 1) {
                                res.json({ message: `Završeno sa greškama. Deblokirano ${updatedCount} vikendica.` });
                            }
                        });
                    } else if (index === cottages.length - 1) {
                        // If last element and no more updates
                        res.json({ message: `Nema vikendica za deblokiranje.` });
                    }
                } else if (index === cottages.length - 1) {
                    // Last iteration but cottage has no blokiranaDo
                    res.json({ message: `Nema vikendica za deblokiranje.` });
                }
            });
        }).catch((err) => {
            console.log("Greška pri pronalaženju vikendica:", err);
            res.json({ message: "Došlo je do greške prilikom učitavanja vikendica." });
        });
    };


    deleteCottage = (req: express.Request, res: express.Response) => {

        CottageModel.deleteOne(
            {id: req.body.id}
            ).then((all)=>{
            res.json({message: "Uspešno brisanje vikendice!"})
        }).catch(err=>{
            console.log(err)
            res.json({message: "Neuspešno brisanje vikendice!"})
        })
    }


    //updates

    updateNaziv = (req: express.Request, res: express.Response) => {

        CottageModel.findOneAndUpdate(
            {id: req.body.id}, 
            {$set : {naziv: req.body.naziv}}).then((all)=>{
            res.json({message: "Uspešna promena naziva vikendice!"})
        }).catch(err=>{
            console.log(err)
            res.json({message: "Neuspešna promena naziva vikendice!"})
        })
    }
    
    updateMesto = (req: express.Request, res: express.Response) => {

        CottageModel.findOneAndUpdate(
            {id: req.body.id}, 
            {$set : {mesto: req.body.mesto}}).then((all)=>{
            res.json({message: "Uspešna promena mesta vikendice!"})
        }).catch(err=>{
            console.log(err)
            res.json({message: "Neuspešna promena mesta vikendice!"})
        })
    } 

    updateUsluge = (req: express.Request, res: express.Response) => {

        CottageModel.findOneAndUpdate(
            {id: req.body.id}, 
            {$set : {usluge: req.body.usluge}}).then((all)=>{
            res.json({message: "Uspešna promena usluga vikendice!"})
        }).catch(err=>{
            console.log(err)
            res.json({message: "Neuspešna promena usluga vikendice!"})
        })
    } 

    updateTelefon = (req: express.Request, res: express.Response) => {

        CottageModel.findOneAndUpdate(
            {id: req.body.id}, 
            {$set : {telefon: req.body.telefon}}).then((all)=>{
            res.json({message: "Uspešna promena kontakta za vikendicu!"})
        }).catch(err=>{
            console.log(err)
            res.json({message: "Neuspešna promena kontakta za vikendicu!"})
        })
    } 

    updateBrojOsoba = (req: express.Request, res: express.Response) => {

        CottageModel.findOneAndUpdate(
            {id: req.body.id}, 
            {$set : {broj_osoba: req.body.broj_osoba}}).then((all)=>{
            res.json({message: "Uspešna promena broja osoba vikendice!"})
        }).catch(err=>{
            console.log(err)
            res.json({message: "Neuspešna promena broja osoba vikendice!"})
        })
    } 

    updateKvadratura = (req: express.Request, res: express.Response) => {

        CottageModel.findOneAndUpdate(
            {id: req.body.id}, 
            {$set : {kvadratura: req.body.kvadratura}}).then((all)=>{
            res.json({message: "Uspešna promena kvadrature vikendice!"})
        }).catch(err=>{
            console.log(err)
            res.json({message: "Neuspešna promena kvadrature vikendice!"})
        })
    } 

    updateLetnji = (req: express.Request, res: express.Response) => {

        CottageModel.findOneAndUpdate(
            {id: req.body.id}, 
            {$set : {letnji_cenovnik: req.body.letnji}}).then((all)=>{
            res.json({message: "Uspešna promena letnje cene vikendice!"})
        }).catch(err=>{
            console.log(err)
            res.json({message: "Neuspešna promena letnje cene vikendice!"})
        })
    } 

    updateZimski = (req: express.Request, res: express.Response) => {

        CottageModel.findOneAndUpdate(
            {id: req.body.id}, 
            {$set : {zimski_cenovnik: req.body.zimski}}).then((all)=>{
            res.json({message: "Uspešna promena usluga vikendice!"})
        }).catch(err=>{
            console.log(err)
            res.json({message: "Neuspešna promena usluga vikendice!"})
        })
    } 

    updateKoordinate = (req: express.Request, res: express.Response) => {

        CottageModel.findOneAndUpdate(
            {id: req.body.id}, 
            {$set : {naziv: req.body.koordinate}}).then((all)=>{
            res.json({message: "Uspešna promena koordinate vikendice!"})
        }).catch(err=>{
            console.log(err)
            res.json({message: "Neuspešna promena koordinate vikendice!"})
        })
    } 


    registerCottage = (req: express.Request, res: express.Response) => {

        let cottage = new CottageModel(req.body.cott)

        CottageModel.findOne(
            {naziv: req.body.cott.naziv, vlasnik: req.body.cott.vlasnik, mesto: req.body.cott.mesto}
        ).then((cot)=>{
            if(cot){
                res.json({message: "Greška: ne sme postojati istoimena vikendica\nu istom mestom sa istim vlasnikom!"})
                return
            }

            cottage.save().then((ok)=>{
                res.json({message:String(req.body.cott.id)})
            }).catch((err)=>{
                console.log(err)
                res.json({message:"Neuspešna registracija!"})
            })
        }).catch((err)=>{
                console.log(err)
                res.json({message:"Neuspešan pristup bazi!"})
            })
    }

    // registerUser = (req: express.Request, res: express.Response) => {
    //         let u = new UserModel(req.body.user)
            
    
    //         UserModel.findOne({korisnicko_ime: req.body.user.korisnicko_ime}).then((tmp)=>{
    //             // let email_check = false
                
    //             if(tmp){
    //                 if(tmp.status=="odbijen" || tmp.status=="aktiviran" || tmp.status=="neregistrovan"){
    //                     res.json({message: "Došlo je do greške kod korisničkog imena!"})
    //                 }
    //                 return
    //             }
    
    //             UserModel.findOne({email:u.email}).then((tmp2)=>{
    //                 if(tmp2){
    //                     return res.json({message: "Došlo je do greške kod e-mail-a"})
    //                 }
    
    //                 u.save().then((ok)=>{
    //                 res.json({message:"Uspešna registracija!"})
    //                 }).catch((err)=>{
    //                     console.log(err)
    //                     res.json({message:"Neuspešna registracija!"})
    //                 })
                
    //             }).catch((err)=>{
    //                 console.log(err)
    //                 res.json({message:"Neuspešna registracija!"})
    //             })  
    
    //             // if(email_check) {
    //             //     res.json({message: "Došlo je do greške kod e-mail-a"})
                           
    //             //     return
    //             // }
    
                
    //         })
    
           
    //     }


}


// searchCompanies = (req: express.Request, res: express.Response)=>{
//         let seachParam = req.body.seachParam;
        
//         CompanyModel.find({
//             $or: [
//                 { naziv: { $regex: seachParam, $options: 'i'}},
//                 { adresa: { $regex: seachParam, $options: 'i'}}
//             ]
//         }).then(firme => {
//             res.json(firme)
//         }).catch( err => {
//             console.log(err)
//         })
//     }
