const mongoose = require("mongoose")
const schema = mongoose.Schema

const user = new schema({
    username : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    DOC : {                     // Date of Creation
        default : Date.now()
    }
})

const User = mongoose.model('User', user)

module.exports = User