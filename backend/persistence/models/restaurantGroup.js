import mongoose from "mongoose";

const RestaurantGroup = mongoose.model("Restaurant Group", new mongoose.Schema(
    {
        id: String,
        name: String,
        description: String,
        restaurantIds: [String]
    }
));

export default RestaurantGroup;