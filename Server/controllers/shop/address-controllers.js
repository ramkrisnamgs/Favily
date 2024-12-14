const Address = require("../../models/Address");


const addAddress = async (req, res) => {
  try {

    const {userId, address, city, pincode, phone, notes} = req.body;

    if(!userId || !address || !city || !pincode || !phone || !notes){
        return res.status(400).json({
            success: false,
            message: "Required Data Missing!"
        })
    }

    const newlyCreatedAddress = new Address({
        userId, address, city, pincode, phone, notes
    })

    await newlyCreatedAddress.save();

    res.status(200).json({
        success: true,
        message: "Address added successfully",
        data: newlyCreatedAddress
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
  }
};


const fetchAllAddresses = async (req, res) => {
    try {

        const {userId} = req.params;

        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User id is required!"
            })
        }

        const addressList = await Address.find({userId});

        res.status(200).json({
            success: true,
            data: addressList
        })

    } catch (error) {
      console.log(error);
      res.status(500).json({
          success: false,
          message: "Internal server error"
      });
    }
  };

  const editAddress = async (req, res) => {
    try {
        
        const {userId, addressId} = req.params;
        const formData = req.body;

        if(!userId || !addressId){
            return res.status(400).json({
                success: false,
                message: "User and address id are required!"
            })
        }

        const address = await Address.findOneAndUpdate({
            _id: addressId,
            userId
        }, formData,{new: true});

        if(!address){
            return res.status(404).json({
                success: false,
                message: "Address not found!"
            })
        }

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data: address
        })

    } catch (error) {
      console.log(error);
      res.status(500).json({
          success: false,
          message: "Internal server error"
      });
    }
  };

  const deleteAddress = async (req, res) => {
    try {
        
        const {userId, addressId} = req.params;
        if(!userId || !addressId){
            return res.status(400).json({
                success: false,
                message: "User and address id are required!"
            })
        }

        const address = await Address.findOneAndDelete({
            _id: addressId,
            userId
        })

        if(!address){
            return res.status(404).json({
                success: false,
                message: "Address not found!"
            })
        }

        res.status(200).json({
            success: true,
            message: "Address deleted successfully",        
        })

    } catch (error) {
      console.log(error);
      res.status(500).json({
          success: false,
          message: "Internal server error"
      });
    }
  };

  module.exports = { addAddress, fetchAllAddresses, editAddress, deleteAddress };