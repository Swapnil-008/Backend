import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        complete: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,  //After this line next line must be reference, It defines that we are taking reference of 'User'
            ref: "User",
            required: true,
        },
        subTodos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SubTodo"
            }
        ],   //Array of Sub-Todos
    },
    {
        timestamps: true
    }
)

const Todo = mongoose.model('Todo', todoSchema)

export default Todo;