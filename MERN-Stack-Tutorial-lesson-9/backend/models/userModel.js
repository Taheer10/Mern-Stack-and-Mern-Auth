const mongoose = require('mongoose');
const brycpt = require('bcrypt');
const validator = require('validator')



const Schema = mongoose.Schema;


const userSchema = new Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

//Static signup Method

userSchema.statics.signup = async function(email, password)  {
    //validation
     
    if (!email || !password) {
        throw Error('All fields must be filled')
        
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not Valid')
    }
    
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not Strong Enough')
        
    }
    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email Already in Use')
    }

    const salt = await brycpt.genSalt(10);
    const hash = await brycpt.hash(password, salt)

    const user = await this.create({email , password: hash})

    return user


}

module.exports = mongoose.model('User', userSchema)