const express = require("express");
const mongoose = require("mongoose");
const { ReadConcern } = require("mongodb");
const path = require('path');
const app = express();

//"mongodb+srv://zoelenore:1415Birchave!@assignment15.dg9dui2.mongodb.net/?retryWrites=true&w=majority&appName=assignment15"

mongoose
    .connect(
        "mongodb+srv://zoelenore:1415Birchave!@assignment15.dg9dui2.mongodb.net/final?retryWrites=true&w=majority&appName=assignment15")
    .then(() => {
        console.log("Connected to mongodb...");
        // Insert pins into MongoDB collection
        insertPins();
    })
    .catch((err) => console.error("could not connect to mongodb...", err));

const propertySchema = new mongoose.Schema({
    size: String,
    material: String,
    shape: String,
    stock: String
});

const pinSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: String,
    image: String,
    properties: [propertySchema]
});

const Pin = mongoose.model("Pin", pinSchema, "pins"); // specifying collection name

// Function to insert pins into MongoDB collection
async function insertPins() {
    try {
        // Delete existing pins
        await Pin.deleteMany({});
        // Insert new pins
        await Pin.insertMany(pins);
        console.log("Crafts inserted successfully");
        process.exit(); // Exit the program after insertion
    } catch (error) {
        console.error("Error inserting pins:", error);
        process.exit(1); // Exit the program with error code 1
    }
}

let pins = [
    {
        "name": "Gamecock Disco Pin",
        "description": "Cute game-day pin",
        "price": "3.00",
        "image": "pin-01.png",
        "properties": {
            "size": "2.5",
            "material": "metal",
            "shape": "circular",
            "stock": "20"
        }
    },
    {
        "name": "Spurs Up Cocky Pin",
        "description": "Cute game-day pin",
        "price": "3.00",
        "image": "pin-02.png",
        "properties": {
            "size": "2.5",
            "material": "metal",
            "shape": "circular",
            "stock": "23"
        }
    },
    {
        "name": "Sandstorm Pin",
        "description": "Cute game-day pin",
        "price": "3.00",
        "image": "pin-03.png",
        "properties": {
            "size": "2.5",
            "material": "metal",
            "shape": "circular",
            "stock": "0"
        }
    },
    {
        "name": "Logo Pin",
        "description": "Cute game-day pin",
        "price": "3.00",
        "image": "pin-04.png",
        "properties": {
            "size": "2.5",
            "material": "metal",
            "shape": "circular",
            "stock": "10"
        }
    },
    {
        "name": "Beamer Ball Pin",
        "description": "Cute game-day pin",
        "price": "3.00",
        "image": "pin-05.png",
        "properties": {
            "size": "2.5",
            "material": "metal",
            "shape": "circular",
            "stock": "10"
        }
    },
    {
        "name": "Garnet Gameday Pin",
        "description": "Cute game-day pin",
        "price": "3.00",
        "image": "pin-06.png",
        "properties": {
            "size": "2.5",
            "material": "metal",
            "shape": "circular",
            "stock": "10"
        }
    },
    {
        "name": "Dixieland Delight Pin",
        "description": "Cute game-day pin",
        "price": "3.00",
        "image": "pin-07.png",
        "properties": {
            "size": "2.5",
            "material": "metal",
            "shape": "circular",
            "stock": "10"
        }
    },
    {
        "name": "Full House Beamer Pin",
        "description": "Cute game-day pin",
        "price": "3.00",
        "image": "pin-08.png",
        "properties": {
            "size": "2.5",
            "material": "metal",
            "shape": "circular",
            "stock": "10"
        }
    },
    {
        "name": "Garnet Helmet Pin",
        "description": "Cute game-day pin",
        "price": "3.00",
        "image": "pin-09.png",
        "properties": {
            "size": "2.5",
            "material": "metal",
            "shape": "circular",
            "stock": "10"
        }
    },
    {
        "name": "Giddy Up Garnet Pin",
        "description": "Cute game-day pin",
        "price": "3.00",
        "image": "pin-10.png",
        "properties": {
            "size": "2.5",
            "material": "metal",
            "shape": "circular",
            "stock": "10"
        }
    },
    {
        "name": "Boots Pin",
        "description": "Cute game-day pin",
        "price": "3.00",
        "image": "pin-11.png",
        "properties": {
            "size": "2.5",
            "material": "metal",
            "shape": "circular",
            "stock": "10"
        }
    },
    {
        "name": "Go Cocks Dog Pin",
        "description": "Cute game-day pin",
        "price": "3.00",
        "image": "pin-12.png",
        "properties": {
            "size": "2.5",
            "material": "metal",
            "shape": "circular",
            "stock": "10"
        }
    }
];

insertPins();