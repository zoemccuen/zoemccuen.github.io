const toggleNav = () => {
    document.getElementById("nav-menu").classList.toggle("hidden");
}

class Pin {
    constructor(pin_id, name, description, price, image, properties) {
        this.pin_id = pin_id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = "images/" + image;
        this.size = properties.size;
        this.material = properties.material;
        this.shape = properties.shape;
        this.stock = properties.stock;
    }

    static async fetch(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            console.log(jsonData);
            const { pins } = jsonData; // Accessing the "pins" array
            const thePins = pins.map(pinData => {
                const { pin_id, name, description, price, image, properties } = pinData;
                return new Pin(pin_id, name, description, price, image, properties);
            });
            return thePins;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    get renderPin() {
        // Add the section for the pin
        const photoSection = document.createElement("section");
        photoSection.classList.add("column-pin");

        // Create the image
        const photoImg = document.createElement("img");
        photoImg.src = this.image;
        photoImg.classList.add("img-pin");
        
        // Name of the pin will be this H3 header
        const heading = document.createElement("h3");
        heading.innerText = this.name;

        if (this.stock == "0") {
            photoImg.classList.add("faded"); // If it's out of stock, make it known
            heading.classList.remove("column-pin");            
            heading.classList.add("out-of-stock");
            this.description = "OUT OF STOCK";
        }

        // Create the description section from the class properties
        const pinDetails = document.createElement("span");
        const pinFactText =
            this.description + "<br>" +
            this.size + " in. " +
            this.shape + " " + this.material + "<br>Available: " + this.stock;
        pinDetails.innerHTML = pinFactText;

        // Build the object in the DOM!
        photoSection.appendChild(photoImg); // Preview image
        photoSection.appendChild(heading); // Appending heading to pinBox
        photoSection.appendChild(pinDetails); // Append the details

        return photoSection;
    }

}

const loadPin = async () => {
    const url = "json/pins.json";
    try {
        const pin = await Pin.fetch(url);
        return await pin;
    } catch (error) {
        0
        console.log(error);
    }
}

const initGallery = async () => {
    let pinArray = await loadPin();
    let photoGallery = document.getElementById("pin-section");
    if (photoGallery !== null) {
        if (pinArray !== undefined && pinArray.length > 0) {
            pinArray.forEach((aPin) => {
                photoGallery.append(aPin.renderPin);
            })
        }
    }
}

window.onload = () => {
    initGallery();
    document.getElementById("nav-toggle").onclick = toggleNav;
};