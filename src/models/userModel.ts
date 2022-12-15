import mongoose from "mongoose";

export interface UserAttributes extends mongoose.Document{
    id:string;
    firstname: string;
    lastname: string;
    username:string;
    address:string;
    email:string;
    phonenumber:string;
    password:string;
    isVerified:boolean;
    googleId:string;
    provider:string;
}



const UserInstance = new mongoose.Schema({
    firstname:{type: String, required:true},
    lastname:{type: String, required:true},
    username:{type: String, required:true, unique:true},
    address:{type: String, required:true},
    email:{type: String, required:true, unique:true},
    phonenumber:{type: String, required:true,},
    password:{type: String, required:true},
    isVerified:{type: Boolean, required: false},
    googleId:{type: String},
    provider:{type: String, required:true},
},{
    timestamps:true
});

export const User = mongoose.model<UserAttributes>('User', UserInstance);