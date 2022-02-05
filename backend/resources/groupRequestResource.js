export class GroupRequestResource {
    constructor(requestBody) {
        GroupRequestResource.validate(requestBody);

        this.name = requestBody.name;
        /* null values are transformed to undefined so they don't get persisted in the DB (saves space) */
        this.description = requestBody.description === null ? undefined : requestBody.description;
        this.restaurantIds = requestBody.restaurantIds;
    }


    static validate(requestBody) {
        const acceptedFields = new Set(["name", "description", "restaurantIds"]);
        const invalidFields = Object.keys(requestBody).filter(k => !acceptedFields.has(k));
        if (invalidFields.length > 0) {
            throw new Error(
                `Invalid fields provided in group request, expected any of: [${[...acceptedFields].join(", ")}], found: [${[...invalidFields].join(", ")}]`
            );
        }
    
        if (requestBody.name === undefined || requestBody.name === null) {
            throw new Error("Invalid group request, name field is required");
        }

        if (requestBody.description === undefined || requestBody.name === null) {
            throw new Error("Invalid group request, description field is required");
        }

        if (requestBody.restaurantIds === undefined || requestBody.restaurantIds === []) {
            throw new Error("Invalid group request, restaurant Ids field is required");
        }

    }
};
