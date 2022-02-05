import { Router } from "express";

import RestaurantService from "../services/restaurantService";
import { RestaurantRequestResource } from "../resources/restaurantRequestResource";

/**
 * create a router, which handles requests sent to a given URL
 * the router is part of the controller layer (MVC pattern), it is only concerned with receiving requests and sending responses
 * keep the controller lean, avoid cluttering with business logic (logic specific to the context of your application)
 */
const router = Router();


/**
 * handle HTTP GET requests to the root URL, which is /api/restaurants (see server.js), a JSON list of restaurants should be returned
 * the specified path ("/") is mapped to an async handler function with 2 parameters. req is the request, res is the response
 * the handler is executed when the endpoint is hit
 */
router.get("/", async (_req, res) => {
    /* the service layer handles business logic, delegate the fetching of restaurants to RestaurantService */
    const result = await RestaurantService.getRestaurants();

    /* if RestaurantService.getRestaurants() returned an error, send the error response */
    if (result.errorMessage) {
        /* HTTP status code 500 indicates an Internal Server Error */
        res.status(500).json(result.errorMessage);
        return;
    }

    /* if successful, return the result along with HTTP status code 200 (OK) */
    res.status(200).json(result.value);
});


/**
 * handle HTTP POST requests to the root URL
 * the restaurant specified in the request body should be created, and the created restaurant should be returned
 */
router.post("/", async (req, res) => {
    /**
     * create a RestaurantRequestResource object instead of using the raw req.body
     * data validators and transformations are applied when constructing the resource,
     * this allows downstream code to make safe assumptions about the data
     */
    let restaurant;
    try {
        /* jump into the RestaurantRequestResource definition to see the validators and transformations */
        restaurant = new RestaurantRequestResource(req.body);
    } catch (error) {
        /* failure to create the resource means req.body contains invalid data, send HTTP status code 400 (Bad Request) */
        res.status(400).json(error.message);
        return;
    }

    /* again, let the service layer handle the business logic of creating a restaurant */
    const result = await RestaurantService.createRestaurant(restaurant);

    if (result.errorMessage) {
        res.status(500).json(result.errorMessage);
        return;
    }

    /* HTTP status code 201 means Created */
    res.status(201).json(result.value);
});


/**
 * handle HTTP PUT requests to the root URL with an id parameter
 * the restaurant with the given id should be updated with req.body, the updated restaurant should then be returned
 */
router.put("/:id", async (req, res) => {
    /* same validations as above */
    let restaurant;
    try {
        restaurant = new RestaurantRequestResource(req.body);
    } catch (error) {
        res.status(400).json(error.message);
        return;
    }

    const result = await RestaurantService.updateRestaurant(req.params.id, restaurant);

    if (result.errorMessage) {
        res.status(500).json(result.errorMessage);
        return;
    }

    res.status(200).json(result.value);
});


/* handle HTTP DELETE requests to the root URL with an id parameter */
router.delete("/:id", async (req, res) => {
    const result = await RestaurantService.deleteRestaurant(req.params.id);
    
    if (result.errorMessage) {
        res.status(500).json(result.errorMessage);
        return;
    }

    /* HTTP status code 204 means No Content */
    res.status(204).json();
})

export default router;
