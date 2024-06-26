const router = require("express").Router();
const Property = require("../models/property.model");
const { isAuthenticated } = require('../middleware/middleware.js')



router.post("/addProperty", isAuthenticated, (req, res, next) => {
  const {
    name,
    imageUrl,
    description,
    address,
    propertyType,
    squareFootage,
    numBaths,
    numBeds,
    price,
    hasHOA,
    amenitiesIncluded,
    inFloodZone,
    submittingUser
  } = req.body;

  if (
    name === "" ||
    description === "" ||
    address === "" ||
    propertyType === "" ||
    squareFootage === null ||
    numBaths === null ||
    numBeds === null ||
    price === null
  ) {
    res.status(400).json({ message: "Please fill in required fields." });
    return;
  }
  if ( submittingUser === ""){
    res.status(400).json({message: 'submitting user not available.'})
  }

//   Property.findOne({ name }).then((foundProperty) => {
//     if (foundProperty) {
//       res.status(400).json({ message: "That property already exists." });
//       return;
//     }
//   });

  return Property.create({
    name,
    imageUrl,
    description,
    address,
    propertyType,
    squareFootage,
    numBaths,
    numBeds,
    price,
    hasHOA,
    amenitiesIncluded,
    inFloodZone,
    submittingUser
  })
    .then((createdProperty) => {
      if (createdProperty) {
        const {
            name,
            imageUrl,
            description,
            address,
            propertyType,
            squareFootage,
            numBaths,
            numBeds,
            price,
            hasHOA,
            amenitiesIncluded,
            inFloodZone,
            _id,
            submittingUser
        } = createdProperty;
        const property = {
            name,
            description,
            address,
            propertyType,
            squareFootage,
            numBaths,
            numBeds,
            price,
            hasHOA,
            amenitiesIncluded,
            inFloodZone,
            _id,
            submittingUser
        };
        res.status(201).json({ property: property });
}
}).catch((err)=>{
    if (err.code === 11000) {
        res.status(400).json({ message: "A property with that key already exists."})
    } else {
        console.error(err);
        res.status(500).json({ message: "Internal server error." });
    }
})
});

//get all properties, rental or for sale
router.get("/properties", (req, res, next) => {
  Property.find()
    .then((property) => res.status(200).json(property))
    .catch((err) => res.json(err));
});

//get just rentals
router.get("/properties/rentals", (req, res, next) => {
    Property.find({ propertyType: "Rental" })
      .then((rentalProperties) => res.status(200).json(rentalProperties))
      .catch((err) => res.json(err));
  });
  
  // Get properties for sale
  router.get("/properties/forSale", (req, res, next) => {
    Property.find({ propertyType: "For Sale" })
      .then((saleProperties) => res.status(200).json(saleProperties))
      .catch((err) => res.json(err));
  });

  //get property info by ID
router.get("/properties/:propertyId", (req, res, next) => {
  Property.findById(req.params.propertyId)
    .then((oneProperty) => res.status(200).json(oneProperty))
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

//update given property
router.put("/properties/:propertyId", (req, res, next) => {
  Property.findByIdAndUpdate(req.params.propertyId, req.body, { new: true })
    .then((oneProperty) => res.status(200).json(oneProperty))
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

//delete the given property
router.delete("/properties/:propertyId", (req, res, next) => {
  const thePropertyId = req.params.propertyId;
  Property.findByIdAndDelete(thePropertyId)
    .then(() => {
      res.json({ message: `Property with ${thePropertyId} is removed successfully.` })
    }
    )
    .catch((err) => res.json(err));
});



module.exports = router;
