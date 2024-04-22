const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const session = require('express-session');
const multer = require('multer')
const cors = require("cors");
const { ReadConcern } = require("mongodb");
const path = require('path');
const app = express();

app.use(express.static("public")); // Use the Public folder for html, scripts, and css
app.use(express.json()); // Process JSON
app.use(cors()); // Cross-site/domain allowance

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/images/'); // Specify your upload destination
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Rename file with timestamp and original extension
    }
});

const upload = multer({ storage: storage });

//"mongodb+srv://zoelenore:1415Birchave!@assignment15.dg9dui2.mongodb.net/?retryWrites=true&w=majority&appName=assignment15"

mongoose
    .connect(
        "mongodb+srv://mikemccuen:zr6NFgctTVw3ghfs@cluster999.4hzcbvx.mongodb.net/pinstore?retryWrites=true&w=majority&appName=Cluster999")
    .then(() => {
        console.log("Connected to mongodb...");        
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

let pins = [];

//Fetch all the pins in Mongo and add them to the Array
Pin.find({}) // Use find() without a callback
    .then(documents => {
        // Iterate over the array of documents
        documents.forEach(doc => {
            // Push each document into the 'pins' array
            pins.push({
                id: doc._id,
                name: doc.name,
                image: doc.image,
                description: doc.description,
                supplies: doc.supplies
            });
        });
    })
    .catch(err => {
        console.error('DB Error retrieving pins:', err);
        // Handle error
    });

/* Delete a pin with the DELETE handler */
app.delete('/api/pins/:id', (req, res) => {
    const recId = req.params.id;
    console.log("Delete Record ID:", recId);

    const objectId = mongoose.Types.ObjectId.createFromHexString(recId);

    Pin.findOneAndDelete({ _id: objectId })
        .then(deletedPin => {
            if (!deletedPin) {
                console.log("Pin not found for deletion");
                return res.status(404).json({ message: 'Pin not found for deletion' });
            }
            console.log("Pin deleted successfully");
            res.status(200).json({ message: 'Pin deleted successfully', deletedPin });
        })
        .catch(error => {
            console.error('Error deleting pin:', error);
            res.status(500).json({ message: 'Error deleting pin' });
        });
});


/* Add a new pin with the POST handler */
app.post("/api/pins", upload.single("image"), (req, res) => {
    let filename;  // Determine filename here

    if (req.file && req.file.filename) {
        filename = req.file.filename;
    } else {
        console.log("Image file is required for new pins");
        res.status(400).send("Image file is required for new pins");
        return;
    }

    // Extract just the filename part if necessary
    filename = extractFilename(filename);

    // Validate the pin data
    const pin = {
        name: req.body.name,
        image: filename,
        description: req.body.description,
        supplies: req.body.supplies.split(",") 
    };

    const validation = validatePin(pin);
    if (validation.error) {
        res.status(400).send("Validation error: " + validation.error.details[0].message);
        return;
    }

    const newPin = new Pin(pin);
    newPin.save()
        .then(savedPin => {
            console.log("Pin saved successfully");
            res.status(201).send(savedPin);
        })
        .catch(error => {
            console.error('DB Error creating pin:', error);
            res.status(500).send('DB Error creating pin');
        });
});

/* Edit an existing pin with the PUT handler */
app.put("/api/pins/:id", upload.single("image"), (req, res) => {
    const pinId = req.params.id;
    let filename;

    if (req.file && req.file.filename) {
        filename = req.file.filename;
    } else if (req.body.imgsrc) {
        filename = extractFilename(req.body.imgsrc);
    } else {
        console.log("No new image uploaded; using existing image info.");
        filename = req.body.image;  // Use existing image if no new file is uploaded
    }

    filename = extractFilename(filename);
    delete req.body.imgsrc;

    const updates = {
        name: req.body.name,
        image: filename,
        description: req.body.description,
        supplies: req.body.supplies.split(",")  
    };

    const validation = validatePin(updates);
    if (validation.error) {
        res.status(400).send("Validation error: " + validation.error.details[0].message);
        return;
    }

    Pin.findByIdAndUpdate(pinId, { $set: updates }, { new: true })
        .then(updatedPin => {
            if (!updatedPin) {
                return res.status(404).send('Pin not found');
            }
            console.log("Pin updated successfully");
            res.send(updatedPin);
        })
        .catch(error => {
            console.error('DB Error updating pin:', error);
            res.status(500).send('DB Error updating pin');
        });
});

app.get("/api/pins", (req, res) => {
    console.log("API Called- Fetching Pins");
    // Fetch all the pins from MongoDB
    Pin.find({})
        .then(documents => {
            // Map each document to the desired format            
            const pins = documents.map(doc => ({
                id: doc._id,
                name: doc.name,                
                description: doc.description,
                price: doc.price,
                image: doc.image,
                properties: doc.properties
            }));
            // Respond with the fetched pins data
            res.json({pins: pins});
        })
        .catch(err => {
            console.error('DB Error retrieving pins:', err);
            // Handle error
            res.status(500).send('DB Error retrieving pins');
        });
});

app.post("/api/pinbyid", (req, res) => {
    const productIds = req.body.productIds;
    console.log("API Called: pinbyid");
    if (!productIds || productIds.length === 0) {
        return res.status(400).send('No product IDs provided');
    }

    // Correctly convert string IDs to MongoDB ObjectId types using `new`
    const objectIds = productIds.map(id => new mongoose.Types.ObjectId(id));

    // Fetch only the documents with _id that are in the productIds array
    Pin.find({
        '_id': { $in: objectIds }
    })
    .then(documents => {
        const pins = documents.map(doc => ({
            id: doc._id,
            name: doc.name,                
            description: doc.description,
            price: doc.price,
            image: doc.image,
            properties: doc.properties
        }));
        res.json({pins: pins});
    })
    .catch(err => {
        console.error('DB Error retrieving pins by IDs:', err);
        res.status(500).send('DB Error retrieving pins by IDs');
    });
});


function extractFilename(url) {
    // Split the URL by forward slashes
    const parts = url.split('/');
    // Get the last part (which should be the filename)
    const filename = parts[parts.length - 1];
    return filename;
}

const validatePin = (pin) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        image: Joi.string().min(5).required(),
        description: Joi.string().min(1).required(),
        supplies: Joi.allow(),
    });
    return schema.validate(pin);
}

app.listen(3000, () => {
    console.log("Listening on port 3000");
});