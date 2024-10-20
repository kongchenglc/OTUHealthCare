import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: {
        type: String,
        enum: ['male', 'female', 'non-binary', 'other'],
        required: true
    },
    age: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    bloodPressure: {
        systolic: Number,
        diastolic: Number
    },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;