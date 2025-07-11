import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber: {
            type: mongoose.Schema.Types.ObjectId, //One who is subscribing
            ref: 'User',
            required: true
        },
        channel: {
            type: mongoose.Schema.Types.ObjectId, //Channel being subscribed to
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema)