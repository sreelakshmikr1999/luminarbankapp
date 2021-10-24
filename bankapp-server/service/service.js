const db = require('./db');
const jwt=require('jsonwebtoken');

const register = (acno, uname, password) => {

    return db.User.findOne({ acno }).then(user => {
        // console.log(user);
        if (user) {
            return {
                statusCode: 422,
                status: false,
                message: "Account already exists!!!! Please Login  "
            }
        }
        else {
            const newUser = new db.User({
                acno,
                uname,
                password,
                balance: 0,
                transaction: []
            })
            newUser.save()
            return {
                statusCode: 200,
                status: true,
                message: "Registration Successfull"
            }
        }
    })
}



const login = (req, acno, pswd) => {
    return db.User.findOne({
        acno,
        password:pswd
    }).then(user => {
        if (user) {
            req.session.currentAcc = user.acno
            //-----------token generation-------------
            // const token =jwt.sign({
            // currentAcc:user.acno
            // },'supersecretkey122323');

            return {
                statusCode: 200,
                status: true,
                message: "Login successfully",
                userName:user.uname,
                currentAcc:user.acno,
            
            }
        } else {
            return {
                statusCode: 422,
                status: false,
                message: "Invalid user"
            }
        }
    })
}
const deposit = (acno, pswd, amt) => {
    var amount = parseInt(amt)
    return db.User.findOne({
        acno,
        password:pswd
    }).then(user => {
        if (!user) {
            return {
                statusCode: 422,
                status: false,
                message: "Invalid user"
            }
        }
        else {
            user.balance += amount
            user.transaction.push({
                amount: amount,
                type: "CREDIT"
            })
            user.save()
            return {
                statusCode: 200,
                status: true,
                message: "Deposit successfully and new balance is:" + user.balance
            }
        }
    })
}

const withDraw = (req,acno, pswd, amt) => {
    var amount = parseInt(amt)
    return db.User.findOne({
        acno,
        password:pswd
    }).then(user => {
        if (!user) {
            return {
                statusCode: 422,
                status: false,
                message: "Invalid user"
            }
        }
        else {
            // if(req.session.currentAcc!=user.acno){
            //     return {
            //         statusCode: 422,
            //         status: false,
            //         message: "Operaion Denied"
            //     }
            // }
            if (user.balance < amount) {
                return {
                    statusCode: 422,
                    status: false,
                    message: "Insufficient balance"
                }
            }
            user.balance -= amount
            user.transaction.push({
                amount: amount,
                type: "DEBIT"
            })
            user.save()
            return {
                statusCode: 200,
                status: true,
                message: "Debited successfully and new balance is:" + user.balance
            }
        }
    })
}


const gettransaction = (acno) => {
    return db.User.findOne({
        acno
    }).then(user=>{
        if(user){
        return {
            statusCode: 200,
            status: true,
            transaction: user.transaction
        }
    }else{
        return {
            statusCode: 422,
            status: false,
            message: "Invalid operation"
        }
    }
    })
   
}

const deteleAcc =(acno)=>{
    return db.User.deleteOne({
        acno:acno
    }).then(user=>{
        if(!user){
            return {
                statusCode: 422,
                status: false,
                message: "Invalid operation"
            }
        }
        return {
            statusCode: 200,
            status: true,
            message: "Account number "+acno+" successfully deleted"
        }
    })
}

module.exports = {
    register,
    login,
    deposit,
    withDraw,
    gettransaction,
    deteleAcc
}