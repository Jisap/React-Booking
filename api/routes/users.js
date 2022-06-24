import express from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// router.get("/checkauthentication", verifyToken, (req, res, next) => {       // Ruta para verificar la validez de un token de un user logueado
//     res.send("hello user, you are logged in");
// });

// router.get("/checkuser/:id", verifyUser, (req, res) => {                        // Ruta para verificar la validez de un user
//     res.send("hello user, you are logged in and can delete your account");
// });

// router.get("/checkadmin/:id", verifyAdmin, (req, res) => {                        // Ruta para verificar la validez de un admin
//     res.send("hello admin, you are logged in and can delete all account");
// });



router.put( "./", verifyUser, updateUser );
router.delete( "/:id", verifyUser, deleteUser );
router.get( "/:id", verifyUser, getUser );
router.get( "/", verifyAdmin, getUsers );

export default router;