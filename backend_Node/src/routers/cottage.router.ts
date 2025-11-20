import express from 'express'
import { CottageController } from '../controllers/cottage.controller'

const cottageRouter = express.Router()

cottageRouter.route('/allCottages').get(
    (req,res) => new CottageController().getAllCottages(req,res)
)

cottageRouter.route('/searchByName').post(
    (req,res) => new CottageController().searchByName(req,res)
)

cottageRouter.route('/searchByNamePlace').post(
    (req,res) => new CottageController().searchByNamePlace(req,res)
)

cottageRouter.route('/searchByPlace').post(
    (req,res) => new CottageController().searchByPlace(req,res)
)

cottageRouter.route('/blockCottage').post(
    (req,res) => new CottageController().setBlockedUntil(req,res)
)

cottageRouter.route('/unblockCottage').post(
    (req,res) => new CottageController().setUnblockedUntil(req,res)
)

cottageRouter.route('/addToGallery').post(
    (req,res) => new CottageController().changeImage(req,res)
)

cottageRouter.route('/removeFromGallery').post(
    (req,res) => new CottageController().deleteImage(req,res)
)

cottageRouter.route('/getById').post(
    (req,res) => new CottageController().getById(req,res)
)

cottageRouter.route('/getOwnerCottages').post(
    (req,res) => new CottageController().getByOwner(req,res)
)

cottageRouter.route('/push_lista_ocena').post(
    (req,res) => new CottageController().addTo_lista_ocena(req,res)
)

cottageRouter.route('/automaticUnblock').post(
    (req,res) => new CottageController().automaticBlokiranaDo_update(req,res)
)

cottageRouter.route('/setNaziv').post(
    (req,res) => new CottageController().updateNaziv(req,res)
)

cottageRouter.route('/setMesto').post(
    (req,res) => new CottageController().updateMesto(req,res)
)

cottageRouter.route('/setUsluge').post(
    (req,res) => new CottageController().updateUsluge(req,res)
)

cottageRouter.route('/setTelefon').post(
    (req,res) => new CottageController().updateTelefon(req,res)
)

cottageRouter.route('/setBrojOsoba').post(
    (req,res) => new CottageController().updateBrojOsoba(req,res)
)

cottageRouter.route('/setKvadratura').post(
    (req,res) => new CottageController().updateKvadratura(req,res)
)

cottageRouter.route('/setLetnjiCenovnik').post(
    (req,res) => new CottageController().updateLetnji(req,res)
)

cottageRouter.route('/setZimskiCenovnik').post(
    (req,res) => new CottageController().updateZimski(req,res)
)

cottageRouter.route('/setKoordinate').post(
    (req,res) => new CottageController().updateKoordinate(req,res)
)

cottageRouter.route('/deleteCottage').post(
    (req,res) => new CottageController().deleteCottage(req,res)
)

cottageRouter.route('/registerCottage').post(
    (req,res) => new CottageController().registerCottage(req,res)
)




export default cottageRouter