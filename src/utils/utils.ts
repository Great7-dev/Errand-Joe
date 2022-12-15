import Joi from 'joi'
import  jwt  from 'jsonwebtoken'

export const registerSchema =Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    address:Joi.string().required(),
    username:Joi.string().required(),
    email:Joi.string().trim().lowercase().required(),
    phonenumber:Joi.string().required().length(11).pattern(/^[0-9]+$/),
    password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    confirm_password:Joi.ref('password')
}).with('password', 'confirm_password')


export const LoginSchema =Joi.object().keys({
    email:Joi.string().trim().lowercase().required(),
    password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
   
})

export const EditProfile = Joi.object().keys({
    firstname:Joi.string().lowercase(),
    lastname:Joi.string(),
    address:Joi.string(),
    email:Joi.string(),
    phonenumber:Joi.string().length(11).pattern(/^[0-9]+$/),
    password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
})

export const generateToken=(user:{[key:string]:unknown}):unknown=>{
    const pass = process.env.JWT_SECRET as string
     return jwt.sign(user,pass, {expiresIn:'7d'})
}

export const options ={
    abortEarly:false,
    errors:{
        wrap:{
            label: ''
        }
    }
}