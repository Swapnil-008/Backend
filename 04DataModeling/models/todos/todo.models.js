import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, //After this line compulsory next line should be reference, It defines that we are taking reference of 'User'
      ref: 'User',
    },
    subTodos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subTodo',
      },
    ], //Array of Sub-Todos
  },
  {
    timestamps: true,
  }
);

export const Todo = mongoose.model('Todo', todoSchema)