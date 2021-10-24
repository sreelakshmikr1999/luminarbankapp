const express = require('express')
const Session = require('express-session')
const dataService = require('./service/service')
const jwt = require('jsonwebtoken');
const cors = require('cors')
const app = express()
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}))
app.use(Session({
    secret: 'randomsecurestring',
    resave: false,
    saveUninitialized: false
}))
const LogMiddleware = (req, res, next) => {
    // if (!req.session.currentAcc) {
    //     return res.json({
    //         statusCode: 422,
    //         status: false,
    //         message: "Please login......"
    //     })
    // }
    next()
}
// const jwtAuthMiddleware = (req, res, next) => {
//     try {
//         const token = req.headers["x-access-token"];
//         const data = jwt.verify(token, 'supersecretkey122323')
//         req.currentAcc = data.currentAcc;
//         next();
//     } catch {
//         res.json({
//             statusCode: 422,
//             status: false,
//             message: "Please Login",
//         })
//     }
// }


    app.use(express.json())

    // app.post('/token',(req, res) => {
    //     res.send("acno"+req.currentAcc)
    // })

    app.post('/register', (req, res) => {
        // console.log(req.body)
        dataService.register(req.body.acno, req.body.uname, req.body.password)
            .then(result => {
                res.status(result.statusCode).json(result)
            })
    })

    app.post('/login',LogMiddleware, (req, res) => {
        // console.log(req.body)
        dataService.login(req, req.body.acno, req.body.password)
            .then(result => {
                res.status(result.statusCode).json(result)
            })
    })
    app.post('/deposit',(req, res) => {
        // console.log(req.session.currentAcc);
        // console.log(req.body)
        dataService.deposit(req.body.acno, req.body.password, req.body.amt)
            .then(result => {
                res.status(result.statusCode).json(result)
            })
    })
    app.post('/withdraw', (req, res) => {
        // console.log(req.body)
        dataService.withDraw(req, req.body.acno, req.body.password, req.body.amt)
            .then(result => {
                res.status(result.statusCode).json(result)
            })
    })
    app.post('/transaction',  (req, res) => {
        console.log(req.body)
        dataService.gettransaction(req.body.acno).then(result => {
            res.status(result.statusCode).json(result)
        })
    })
    app.delete('/deleteAcc/:acno', (req, res) => {
        dataService.deteleAcc(req.params.acno).then(result => {
            res.status(result.statusCode).json(result)
        })
    })
    app.listen(3000, () => {
        console.log("server started at port number:3000");
    })
