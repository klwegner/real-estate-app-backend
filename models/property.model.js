const { Schema, model } = require("mongoose");

const propertySchema = new Schema(
  {
    propertyId: {type: Schema.Types.ObjectId, ref: 'Property'},
    name: {
      type: String,
      unique: true,
      require: true
    },
    description: {
        type: String,
        require: true
    },
    address: {
        type: String,
        unique: true,
        require: true
      },
    propertyType: {
        type: String,
        require: true
    },
    squareFootage: {
        type: Number,
        require: true
      },
      numBaths: {
        type: Number,
        require: true
      },
      numBeds: {
        type: Number,
        require: true
      },
    price: {
        type: Number,
        require: true
    },
    hasHOA: Boolean,
    amenitiesIncluded: String,
    inFloodZone: Boolean

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Property = model("Property", propertySchema);

module.exports = Property;
