const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/BankApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const User = mongoose.model('User', {
    acno: Number,
    uname: String,
    password: String,
    balance: Number,
    transaction: []
})
module.exports = {
    User
}