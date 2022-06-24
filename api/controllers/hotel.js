import Hotel from "../models/hotel.js"
import Room from "../models/Room.js"

export const createHotel = async (req, res, next) => {

    const newHotel = new Hotel( req.body )

    try{
        const savedHotel = await newHotel.save()
        res.status(200).json(savedHotel)
    }catch(err){
        next(err)
    }
}

export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const updateHotel = async(req,res,next) => {

    try{
        const updatedHotel = await Hotel.findByIdAndUpdate( req.params.id, { $set:req.body }, { new: true } )
        res.status(200).json( updatedHotel )
    }catch(err){
        next(err)
    }
};

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

export const getHotels = async(req, res, next) => {

  const { min, max, ...others } = req.query;  // La petición podría tener los precios min y max y el limite de rdos, featured=true (others) y city
  
    try{                                                                //>=min       <=max 
        const hotels = await Hotel.find({...others, cheapestPrice: { $gt: min | 1, $lt: max || 999 },}).limit( req.query.limit ); // 
        res.status(200).json( hotels );
    }catch(err){
        next(err);                          // Si hay err se envía a el middleware de errores en el index.js
    }

}

export const countByCity = async(req, res, next) => { // Hoteles por ciudad

  const cities = req.query.cities.split(",");  // Las ciudades vendrán en un query ( url ) y será en principio un string -> array con split

    try{
        const list = await Promise.all(cities.map(city => { // Promise.all es una función que se encarga de ejecutar todas las promesas en paralelo
          return Hotel.countDocuments({ city: city });      // Obtendremos un array con el nº de hoteles por cidudad
        }))
        res.status(200).json( list );
    }catch(err){
        next(err);                          // Si hay err se envía a el middleware de errores en el index.js
    }

}

export const countByType = async(req, res, next) => {

  try{

    const hotelCount = await Hotel.countDocuments({ type: "hotel" });         // Nº de hoteles con el type="hotel"
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" }); // Nº de apartamentos con el type="apartment"
    const resortCount = await Hotel.countDocuments({ type: "resort" });       // etc
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);

    }catch(err){
        next(err);                          // Si hay err se envía a el middleware de errores en el index.js
    }

}

export const getHotelRooms = async( req, res, next ) => {

  try {
    const hotel = await Hotel.findById( req.params.id );        // Buscamos el hotel con el id que nos llega por la url
    const list = await Promise.all(hotel.rooms.map( (room) => { // rooms es un array con los ids de las habitaciones del hotel
      return Room.findById( room );                             // Buscamos las habitaciones según esas ids del hotel                          
    }));
    res.status(200).json( list );
  } catch (err) {
    next(err);                              // Si hay err se envía a el middleware de errores en el index.js
  }
}

