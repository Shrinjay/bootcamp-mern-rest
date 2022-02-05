import RestaurantGroup from "../persistence/models/restaurantGroup";
import { ResponseResource } from "../resources/responseResource";
import { GroupResponseResource } from "../resources/groupResponseResource";

async function createRestaurantGroup(restaurant) {
    try {
        /* again, using the mongoose model to insert a new restaurant into MongoDB */
        const newRestaurantGroup = await RestaurantGroup.create(restaurant);
        return new ResponseResource(new GroupResponseResource(newRestaurant));
    } catch (error) {
        return new ResponseResource(null, error.message);
    }
}