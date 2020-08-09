const validator = require('validator');
const Mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task=require('../models/task')


const userSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive');
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Invalid password');
            }
        }

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref:'Task',
    localField:'_id',
    foreignField: 'owner'
})

// Fix the dumb mongoose unique bug
var uniqueValidator = require('mongoose-unique-validator');
userSchema.plugin(uniqueValidator)

//check email and password
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('User email doesn\'t exist')
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw new Error('Wrong password')
    }
    return user
}

//generate json web token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token

}

//get user public profile
userSchema.methods.toJSON =  function () {
    const user = this
    const userObject=user.toObject()

    

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject


}

//hash password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
//remove tasks before removing users
userSchema.pre('remove', async function(next){
    const user=this
    await Task.deleteMany({owner: user._id})


    next()
})

const User = Mongoose.model('User', userSchema)

module.exports = User