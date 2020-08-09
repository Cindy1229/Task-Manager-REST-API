const Mongoose = require('mongoose')
const { model } = require('./user')

const taskSchema=new Mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps:true
})
const Task = Mongoose.model('Task',taskSchema)

module.exports = Task