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
    const url = "JSON/pins.json?" + new Date().getTime();;
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

const showEmailResult = async () => {
    const theForm = document.getElementById("contact-form");
    const result = document.getElementById("result");
    theForm.preventDefault;
    let response = await getEmailResult();
    if (response.status == 200) {
        result.innerHTML = "Thank you for your feedback!";
    } else {
        result.innerHTML = "Your feedback was unsuccessful, please try again!";
    }
};

const getEmailResult = async (e) => {
    const form = document.getElementById("contact-form");
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    const result = document.getElementById("result");
    result.innerHTML = "Loading ...";

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        });
        const jsonResponse = await response.json();
        if (response.status == 200) {
            result.innerHTML = "Form submitted successfully";
        } else {
            console.log(response);
            result.innerHTML = jsonResponse.message;
        }
    } catch (error) {
        console.log(error);
        result.innerHTML = "Something went wrong!";
    } finally {
        form.reset();
        setTimeout(() => {
            result.style.display = "none";
        }, 3000);
    }
};

const submitEmail = (e) => {
    e.preventDefault();
    document.getElementById("results").classList.remove("hidden");

    const form = document.getElementById("form-email");
    const emailName = form.elements["email-name"].value;

    console.log(emailName);
};

const addDesign = () => {
    const form = document.getElementById("design-form");
    const formData = new FormData(form);
    let resultString = "";

    // Store the original HTML content of the form
    const originalFormHTML = form.innerHTML;

    // Iterate through the form data entries and construct the result string
    for (const [key, value] of formData.entries()) {
        resultString += `${key}: ${value}<br>`; // Concatenate key and value with a colon and space
    }

    // Set the innerHTML of the result element to the constructed result string
    document.getElementById("result").innerHTML = resultString;

    // Clear the form's innerHTML and display the confirmation message
    form.innerHTML = "<h4>Thank you for submitting your design!</h4>";

    // Wait for 2 seconds and then restore the original HTML content of the form
    setTimeout(() => {
        form.innerHTML = originalFormHTML;
    }, 2000);
}

window.onload = () => {
    initGallery();
    document.getElementById("nav-toggle").onclick = toggleNav;
    if (document.getElementById("contact-form") != null) {
        document.getElementById("contact-form").addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent default form submission            
        });
        document.getElementById("contact-form").onsubmit = showEmailResult;
    }

    if (document.getElementById("design-form") != null) {
        document.getElementById("design-form").addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent default form submission            
        });
        document.getElementById("design-form").onsubmit = addDesign;        
    }
};