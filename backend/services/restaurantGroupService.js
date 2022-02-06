import RestaurantGroup from "../persistence/models/restaurantGroup";
import { ResponseResource } from "../resources/responseResource";
import { GroupResponseResource } from "../resources/groupResponseResource";
import { ProcessedRestaurantGroupResponseResource } from "../resources/restaurantProcessedGroupsResponseResource";
import RestaurantService from "./restaurantService";

async function createRestaurantGroup(restaurant) {
    try {
        /* again, using the mongoose model to insert a new restaurant into MongoDB */
        const newRestaurantGroup = await RestaurantGroup.create(restaurant);
        return new ResponseResource(new GroupResponseResource(newRestaurantGroup));
    } catch (error) {
        return new ResponseResource(null, error.message);
    }
}


async function ProcessedRestaurantGroup(restaurantGroups) {
    const processedResponse = await Promise.all(
        restaurantGroups.map( async r => {
            var processed;
    
            processed = {
                ...r,
                restaurants: await Promise.all(r.restaurantIds.map(async id => await RestaurantService.retriveRestaurantbyID(id)))
            }
    
            delete processed.restaurantIds;
            return processed;
        })
    )
    return new ResponseResource(processedResponse.map(r => new ProcessedRestaurantGroupResponseResource(r)))
}

async function retriveRestaurantGroup(id) {
    const restaurantGroup = await RestaurantGroup.findbyId(id);

    return restaurantGroup.map(r => new GroupResponseResource(r))
}

async function retriveRestaurantGroups() {
    const restaurantGroup = await RestaurantGroup.find();

    return restaurantGroup.map(r => new GroupResponseResource(r))
}

const RestaurantGroupService = {createRestaurantGroup, ProcessedRestaurantGroup, retriveRestaurantGroup, retriveRestaurantGroups}
export default RestaurantGroupService