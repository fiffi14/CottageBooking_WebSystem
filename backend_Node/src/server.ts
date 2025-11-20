import express from 'express'
import cors from 'cors'
import userRouter from './routers/user.router'
import mongoose from 'mongoose'
import cottageRouter from './routers/cottage.router'
import reservationRouter from './routers/reservation.router'

const app = express()

app.use(cors()) // add this maybe { origin: 'http://localhost:4200' }
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/vikendica')
const conn = mongoose.connection
conn.once('open',()=>{console.log("*** DB CONNECTED ***")})


const router = express.Router()

router.use('/user', userRouter)
router.use('/cottage', cottageRouter)
router.use('/reservation', reservationRouter)

app.use('/', router)

app.use('/profileImages', express.static('./profileImages'))
app.use('/galleryImages', express.static('./galleryImages'))
app.listen(4000, ()=>console.log('Express running on port 4000'))
