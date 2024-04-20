const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
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


mongoose
    .connect(
        "mongodb+srv://zoelenore:1415Birchave!@assignment15.dg9dui2.mongodb.net/final?retryWrites=true&w=majority&appName=assignment15")
    .then(() => console.log("Connected to mongodb..."))
    .catch((err) => console.error("DB Error: Could not connect to MongoDB.", err));

const pinSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    supplies: [String]
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const Pin = mongoose.model("pins", pinSchema);

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
                price: doc.price,
                properties: doc.properties
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
        price: req.body.price,
        properties: req.body.properties.split(",") 
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
        price: req.body.price,
        properties: req.body.properties.split(",")  
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
        price: Joi.string().min(5).required(),
        properties: Joi.allow(),
    });
    return schema.validate(pin);
}

app.get("/api/pins", (req, res) => {
    // Fetch all the pins from MongoDB
    Pin.find({})
        .then(documents => {
            // Map each document to the desired format
            const pins = documents.map(doc => ({
                id: doc._id,
                name: doc.name,
                image: doc.image,
                description: doc.description,
                price: doc.price,
                properties: doc.properties
            }));
            // Respond with the fetched pins data
            res.json(pins);
        })
        .catch(err => {
            console.error('DB Error retrieving pins:', err);
            // Handle error
            res.status(500).send('DB Error retrieving pins');
        });
});

app.listen(3006, () => {
    console.log("Listening on port 3006");
});