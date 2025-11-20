import express from 'express'
import { UserController } from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.route('/login').post(
    (req,res) => new UserController().login(req,res)
)

userRouter.route('/allOwners').get(
    (req,res) => new UserController().getAllOwners(req,res)
)

userRouter.route('/allTourists').get(
    (req,res) => new UserController().getAllTourists(req,res)
)

userRouter.route('/registerUser').post(
    (req,res) => new UserController().registerUser(req,res)
)

userRouter.route('/userByMail').post(
    (req,res) => new UserController().getUserByEmail(req,res)
)

userRouter.route('/userByUsername').post(
    (req,res) => new UserController().getUserByUsername(req,res)
)

userRouter.route('/updateImage').post(
    (req,res) => new UserController().changeImage(req, res)
)

userRouter.route('/updatePassword').post(
    (req,res) => new UserController().updatePassword(req,res)
)

userRouter.route('/updateFirstname').post(
    (req,res) => new UserController().updateFirstname(req,res)
)
userRouter.route('/updateLastname').post(
    (req,res) => new UserController().updateLastname(req,res)
)
userRouter.route('/updateAddress').post(
    (req,res) => new UserController().updateAddress(req,res)
)
userRouter.route('/updatePhoneNumber').post(
    (req,res) => new UserController().updatePhoneNumber(req,res)
)
userRouter.route('/updateEmail').post(
    (req,res) => new UserController().updateEmail(req,res)
)
userRouter.route('/updateCardNumber').post(
    (req,res) => new UserController().updateCardNumber(req,res)
)

userRouter.route('/deleteUser').post(
    (req,res) => new UserController().deleteUser(req,res)
)
userRouter.route('/deactivateUser').post(
    (req,res) => new UserController().deactivateUser(req,res)
)
userRouter.route('/activateUser').post(
    (req,res) => new UserController().activateUser(req,res)
)
userRouter.route('/denyUser').post(
    (req,res) => new UserController().denyUser(req,res)
)
userRouter.route('/acceptUser').post(
    (req,res) => new UserController().acceptUser(req,res)
)

userRouter.route('/deleteProfilePic').post(
    (req,res) => new UserController().deleteImage(req,res)
)




export default userRouter