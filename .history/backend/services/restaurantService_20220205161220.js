/**
 * Restaurant is a mongoose model (data access object) defined in the specified file,
 * it references the "restaurants" collection in our MongoDB database
 */
import Restaurant from "../persistence/models/restaurant";
import { ResponseResource } from "../resources/responseResource";
import { RestaurantResponseResource } from "../resources/restaurantResponseResource";

/**
 * while our business logic is really simple so far, it is beneficial to keep it apart from the controller logic
 * see note (1) below for an example of the type of logic that belongs here
 * separation of concerns leads to maintainable code as the application grows, and also makes the code easier to unit test
 */

async function getRestaurants() {
    try {
        /**
         * since Restaurant is a mongoose model, we can call the mongoose find() method on it
         * calling Restaurant.find() will query our restaurant collection in MongoDB and return the results asynchronously
         * find() optionally takes a filter parameter, but we leave it blank since we want to retrieve all restaurants
         */
        const restaurants = await Restaurant.find();

        /**
         * note (1): suppose in the future we want to return the average restaurant rating along with the restaurants
         * this would be the ideal place to add that logic
         */

        /**
         * convert the raw DB records to a list of RestaurantResponseResource and wrap in a ResponseResource
         * jump into the RestaurantResponseResource definition to view the transformations applied
         */
        return new ResponseResource(restaurants.map(r => new RestaurantResponseResource(r)));
    } catch (error) {
        return new ResponseResource(null, error.message);
    }
}


async function createRestaurant(restaurant) {
    try {
        /* again, using the mongoose model to insert a new restaurant into MongoDB */
        const newRestaurant = await Restaurant.create(restaurant);
        return new ResponseResource(new RestaurantResponseResource(newRestaurant));
    } catch (error) {
        return new ResponseResource(null, error.message);
    }
}


async function updateRestaurant(id, restaurant) {
    try {
        /* unlike create(), findByIdAndUpdate() does not automatically run validators, so we specify it as an option */
        const modifiedRestaurant =
            await Restaurant.findByIdAndUpdate(id, restaurant, { new: true, runValidators: true });
        return new ResponseResource(new RestaurantResponseResource(modifiedRestaurant));
    } catch (error) {
        return new ResponseResource(null, error.message);
    }
}

async function deleteRestaurant(id) {
    try {
        const deleted = await Restaurant.findByIdAndDelete(id);

        // TODO: this should ideally be handled earlier, should be 400 instead of 500 error
        if (!deleted) {
            throw new Error(`Attempted to delete restaurant with id = ${id} but it was not found`);
        }

        return new ResponseResource(null);
    } catch (error) {
        console.log(error)
        return new ResponseResource(null, error.message);
    }
}

const RestaurantService = { getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant };
export default RestaurantService;
