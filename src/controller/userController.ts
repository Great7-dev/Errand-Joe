import express,{Request,Response,NextFunction}  from "express"
import {v4 as uuidv4, validate} from "uuid";
import { User } from '../models/userModel';
import bcrypt from 'bcryptjs'
import { EditProfile, generateToken, LoginSchema, options, registerSchema } from "../utils/utils";

export async function RegisterUser(req:Request, res:Response, next:NextFunction) {
    const id = uuidv4()
    try{
        const validateResult = registerSchema.validate(req.body,options)
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
            })
        }
        const duplicatEmail =  await User.findOne({email: req.body.email})
        if(duplicatEmail){
            return res.status(409).json({
                msg:"Email has be used already"
            })
        }
        const duplicatePhone = await User.findOne({phonenumber: req.body.phonenumber})
        if(duplicatePhone){
           return res.status(409).json({
                msg: 'Phone number has been used already'
            })
        }
        const passwordHash = await bcrypt.hash(req.body.password, 8)
        const record = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email:req.body.email,
            address:req.body.address,
            phonenumber:req.body.phonenumber,
            password:passwordHash
         })
       return res.status(200).json({
            message:"You have successfully signed up.",
            record
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'failed to register',
            route:'/register'

        })
    }

  }

  export async function LoginUser(req:Request, res:Response, next:NextFunction) {
    const id = uuidv4()
    try{
        const validateResult = LoginSchema.validate(req.body,options)
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
            })
        }
        const user =  await User.findOne({email: req.body.email}) as unknown as {[key:string]:string};

       const {id} = user
       const token = generateToken({id})
       res.cookie('mytoken', token, {httpOnly:true})
       res.cookie('id',id,{httpOnly:true})
       const validUser= await bcrypt.compare(req.body.password, user.password)
       if(!validUser){
        res.status(401)
       res.json({message: "incorrect password"  
         })
       }
       if(validUser){
       res.status(200)
       res.json({message: "login successful",
          token,
          user   
         })
       }
    } catch(err){
        console.log(err)
        res.status(500)
        res.json({
            message:'failed to login',
            route:'/login'

        })
    }

  }

  export async function UpdateProfile(req:Request, res:Response, next:NextFunction){
    try{
        const { id } = req.params
        // const id = req.params
        const {firstname, lastname, email, address, phonenumber, password} = req.body
        const validateResult = EditProfile.validate(req.body,options)
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
            })
        }
        const record = await User.findById(id)
        if(!record){
            res.status(404).json({
                      Error:"cannot find profile",
                })   
        }
        
         const updaterecord = await User.findByIdAndUpdate(id,{
            firstname: firstname, 
            lastname: lastname,
            email: email,
            address: address,
            phonenumber: phonenumber,
            password: password
         },
         {new:true})
         res.status(200).json({
            message: 'you have successfully updated your profile',
            record: updaterecord 
         })
    }catch(error){
           res.status(500).json({
            msg:'failed to update',
            route: '/update/:id'

           })
    }
}

