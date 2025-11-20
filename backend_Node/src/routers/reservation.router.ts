import express from 'express'
import { ReservationController } from '../controllers/reservation.controller'

const reservationRouter = express.Router()

reservationRouter.route('/allReservations').get(
    (req,res) => new ReservationController().getReservations(req,res)
)

reservationRouter.route('/addReservation').post(
    (req,res) => new ReservationController().addReservation(req,res)
)

reservationRouter.route('/reservationsByTourist').post(
    (req,res) => new ReservationController().getReservationsByTourist(req,res)
)

reservationRouter.route('/reservationsByOwner').post(
    (req,res) => new ReservationController().getReservationsByOwner(req,res)
)

reservationRouter.route('/cancelReservation').post(
    (req,res) => new ReservationController().cancel(req,res)
)

reservationRouter.route('/review').post(
    (req,res) => new ReservationController().setCommentGrade(req,res)
)

reservationRouter.route('/resByOwnerSorted').post(
    (req,res) => new ReservationController().getReservationsByOwnerSorted(req,res)
)

reservationRouter.route('/deniedReservation').post(
    (req,res) => new ReservationController().denyRes(req,res)
)


reservationRouter.route('/acceptedReservation').post(
    (req,res) => new ReservationController().setStatusToAccepted(req,res)
)

reservationRouter.route('/deleteRes').post(
    (req,res) => new ReservationController().deleteReservations(req,res)
)

reservationRouter.route('/autoDeny').post(
    (req,res) => new ReservationController().autoDenyPastReservations(req,res)
)

reservationRouter.route('/res_owner_place_name').post(
    (req,res) => new ReservationController().getReservationsBy_OwnerNamePlace(req,res)
)

reservationRouter.route('/deleteOdbijena').post(
    (req,res) => new ReservationController().deleteOdbijena(req,res)
)

export default reservationRouter