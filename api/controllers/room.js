
import Hotel from "../models/hotel.js";
import Room from "../models/Room.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => { // Para crear una room necesitaremos el id del hotel y los datos de la room contenidos en su modelo

    const hotelId = req.params.hotelid;         // Obtengo de la url el id del hotel
    const newRoom = new Room( req.body );       // Creo un nuevo objeto de tipo Room con los datos del body

    try{
        const savedRoom = await newRoom.save(); // Guardo el nuevo objeto en la base de datos
        console.log(savedRoom);
            try {
                await Hotel.findByIdAndUpdate( hotelId, { $push: { rooms: savedRoom._id } } ); // Agrego el id del nuevo objeto Room al array rooms del Hotel
            } catch (error) {
                next(error);
            }
        res.status(200).json(savedRoom);       // Envío el nuevo objeto Room a la respuesta

    }catch( err ){
        next( err )
    }
}

export const updateRoom = async (req, res, next) => {   // Para actualizar una room
  try {
    const updatedRoom = await Room.findByIdAndUpdate(   // Buscamos la Room según el id y establecemos el body que viene en el request
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoomAvailability = async (req, res, next) => {   // Para actualizar la disponibilidad de una room
  try {
    await Room.updateOne(                                               // Actualizaremos una roomNumbers   
      { "roomNumbers._id": req.params.id },                             // Apuntando a su id 
      { $push:{ "roomNumbers.$.unavailableDates" : req.body.dates }})   // y modificando el array de unavailableDates
    res.status(200).json("Room status has been updated");
  } catch (err) {
    next(err);
  }
};



export const deleteRoom = async (req, res, next) => {   // Para eliminar una room
  
  const hotelId = req.params.hotelid;                   // Obtengo de la url el id del hotel
  try {
    await Room.findByIdAndDelete(req.params.id);        // Buscamos la Room según su id y eliminamos el objeto
    try {
      await Hotel.findByIdAndUpdate(hotelId, {          // Despues actualizamos de la bd de Hotel. 1º Buscamos el Hotel según su id y 2º eliminamos el id de la room del array rooms
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};