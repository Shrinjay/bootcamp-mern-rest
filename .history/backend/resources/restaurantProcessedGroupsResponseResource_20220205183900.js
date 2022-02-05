export class ProcessedRestaurantGroupResponseResource {
    constructor(dbRecord) {
        /* MongoDB documents have an auto-generated _id field, convert to id in our API response */
        this.id = dbRecord._id;
        this.name = dbRecord.name;
        /**
         * undefined values will not get serialized in the JSON response
         * for consistency in our API responses, we want to always return all fields, so transform undefineds to nulls
         */
        this.description = dbRecord.description === undefined ? null : dbRecord.description;
        this.restaurants = dbRecord.restaurants === undefined ? null : dbRecord.restaurants;


        /* MongoDB documents also have a version key __v, which we ignore */
    }
};
