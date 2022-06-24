import jwt from 'jsonwebtoken';
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {                           // Función para validar el token de un user logueado
    const token = req.cookies.access_token;                                // Obtenemos el token de la cookie
    if(!token){                                                            // Si no existe el token mensaje de error
        return next(createError( 401, "You are not authenticated"));
    }

    jwt.verify(token, process.env.JWT, ( err, user ) => {                  // Si hay token verficamos su validez en base al secret JWT, el rdo podrá ser un error o un user.
        if(err) return next(createError( 403, "Token is not valid"));      // Si no es valido mensaje de error.
        req.user = user;                                                   // Si es valido guardamos el user en el request. 
        next();                                                            // Si todo es correcto pasamos al siguiente middleware.
    });                      
}

export const verifyUser = (req, res, next) => {                             // Función para validar las acciones de un user
    verifyToken( req, res, () => {                                          // Si el token de ese user es válido
        if( req.user.id === req.params.id || req.user.isAdmin) {            // miramos si el id del user logeado es igual al que viene en la url
            next();                                                         // si es correcto pasamos al siguiente middleware
        }else{
            if( err ) return next( createError( 403, "You are not authorized"));    // si no es correcto mensaje de error
        }
    });
}

export const verifyAdmin = (req, res, next) => {                             // Función para validar las acciones de un admin
    verifyToken( req, res, () => {                                           // Si el token de ese user es válido
        if( req.user.isAdmin ) {                                             // miramos si el user es un admin
            next();                                                          // si lo es pasamos al siguiente middleware
        }else{
            if( err ) return next( createError( 403, "You are not authorized"));    // si no es correcto mensaje de error
        }
    });
}