import jwt from "jsonwebtoken";
import User from "../models/User.js"
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";



export const register = async (req, res, next ) => {
    try {

        const salt = bcrypt.genSaltSync(10);                    // Método de encriptación 
        const hash = bcrypt.hashSync(req.body.password, salt);  // Encriptación de password

        const newUser = new User({
        //    username: req.body.username,
        //    email: req.body.email,
           ...req.body,                                         // ...req.body: copia todos los campos de req.body a newUser
           password: hash,                                      //  y también la encriptación de la password
        });

       await newUser.save();
       res.status(200).send("User has been created");

    } catch (err) {
        next(err)
    }
}

export const login = async (req, res, next ) => { // api/auth/login
    try {

        const user = await User.findOne({ username: req.body.username });                   // Buscamos el usuario en la bd
        if(!user) return next(createError( 404, "User not found" ));

        const isPasswordCorrect = await bcrypt.compare( req.body.password, user.password )  // Validamos la pass
         if(!isPasswordCorrect) return next(createError( 400, "Bad request" ));

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin } , process.env.JWT ); // Creamos el jwt
        const { password, isAdmin, ...otherDetails } = user._doc;                           // Extraemos del user la pass y su role para que no se muestren

       res                                             // Verificado el usuario, la password, creado el token y definido el payload del user
        .cookie("access_token", token,{                // establecemos una cookie con el token 
            httpOnly: true,
        })
        .status(200)
        .json({details:{ ...otherDetails }, isAdmin});   // y enviamos el payload del user y la prop isAdmin para las rutas protegidas en el Admin Panel

    } catch (err) {
        next(err)
    }
}