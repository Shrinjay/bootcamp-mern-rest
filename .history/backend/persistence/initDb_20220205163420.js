/**
 * mongoose is a object document modelling (ODM) library for MongoDB and Node.js
 * it is somewhat similar to ORMs like SQLAlchemy, Sequelize, ActiveRecord, etc.
 */
import mongoose from "mongoose";

import Restaurant from "./models/restaurant";
import { SEED_RESTAURANT_DATA } from "./seedRestaurantData";

/* change to true if you would like to seed the DB with test restaurant data (will drop any existing data) */
const SEED_DB = false;

export function connectDb() {
    /* mongoose provides abstracted methods for interacting with MongoDB, like connecting to the database */
    mongoose.connect(
        /* DATABASE_URL is an environment variable loaded from the .env file, do not expose its raw value in the source code */
        encodeURI(process.env.DATABASE_URL),
        { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false },
        (error) => {
            if (error) {
                console.error("Error connecting to MongoDB: " + error.message);
            } else {
                console.info("Successfully connected to MongoDB!");

                if (SEED_DB) {
                    seedDb();
                }
            }
        }
    );
}

async function seedDb() {
    await Restaurant.deleteMany();

    SEED_RESTAURANT_DATA.forEach(async (r) => {
        await Restaurant.create(r);
    });

    console.info("Successfully seeded the database!");
}
