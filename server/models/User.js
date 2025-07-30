import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// const UserSchema = new Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     cart: [
//         {
//             productId: { type: Schema.Types.ObjectId, ref: 'products' },
//             quantity: { type: Number, default: 1 }
//         }
//     ]
// });

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: [
        {
            productId: { type: String }, // <-- Change from ObjectId to String
            quantity: { type: Number, default: 0 }
        }
    ]
});

const UserModel = model('users', UserSchema);
export default UserModel;


