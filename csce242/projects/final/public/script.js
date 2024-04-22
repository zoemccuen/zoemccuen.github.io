const toggleNav = () => {
    document.getElementById("nav-menu").classList.toggle("hidden");
}

class Pin {
    constructor(pin_id, name, description, price, image, propertiesArray) {
        this.pin_id = pin_id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = "images/" + image;

        // Since propertiesArray is actually an array, extract the first object
        if (propertiesArray && propertiesArray.length > 0) {
            const properties = propertiesArray[0];
            this.size = properties.size;
            this.material = properties.material;
            this.shape = properties.shape;
            this.stock = properties.stock;
        } else {
            // Default values if properties are missing or the array is empty
            this.size = '2.5';
            this.material = 'Metal';
            this.shape = 'Circular';
            this.stock = '0';
        }

    }

    static async fetch(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            const { pins } = jsonData; // Assuming pins is an array

            const thePins = pins.map(pinData => {
                const { id: pin_id, name, description, price, image, properties } = pinData;
                return new Pin(pin_id, name, description, price, image, properties);
            });

            return thePins;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    static async fetchByIds(url, ids) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productIds: ids })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            const { pins } = jsonData;

            return pins.map(pinData => new Pin(pinData.id, pinData.name, pinData.description, pinData.price, pinData.image, pinData.properties));
        } catch (error) {
            console.error('Error fetching pins by IDs:', error);
            return [];
        }
    }

    // Create the Pins in the Designs section, adding an "add to card" button if the stock is >0
    get renderPinDesigns() {
        let addButtonHtml = ""; // Initialize the "add to cart" button to nothing. We'll set it in the stock check portion
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
        } else {
            //if it's not out of stock, add an "add to cart" button
            if (!isIdInCart(this.pin_id)) {
                addButtonHtml = "<button class='add-to-cart' id='add-" + this.pin_id + "'>Add To Cart</button>";
            } else {
                addButtonHtml = "<button class='in-cart'>In your cart!</button>";
            }
        }

        // Create the description section from the class properties
        const pinDetails = document.createElement("span");
        const pinFactText =
            this.description + "<br>" +
            this.size + " in. " +
            this.shape + " " + this.material + "<br>$" + this.price + "<br>Available: " + this.stock + "<br>" + addButtonHtml;
        pinDetails.innerHTML = pinFactText;

        // Build the object in the DOM!
        photoSection.appendChild(photoImg); // Preview image
        photoSection.appendChild(heading); // Appending heading to pinBox
        photoSection.appendChild(pinDetails); // Append the details

        return photoSection;
    }
}

// Function to see if a PIN ID is in the shopping cart already
function isIdInCart(itemId) {
    // Fetch the shopping cart data from the cookie
    const cartCookie = getCookie('shoppingCart');
    const cart = cartCookie ? JSON.parse(cartCookie) : [];

    // Check if the cart contains the item ID
    const itemInCart = cart.some(item => item.id === itemId);
    return itemInCart;
}


async function loadCart() {
    const url = "http://192.168.1.72:3000/api/pinbyid";
    const cart = JSON.parse(getCookie('shoppingCart') || '[]');
    const cartProductIds = cart.map(item => item.id);
    try {
        const pins = await Pin.fetchByIds(url, cartProductIds);
        return await pins;
    } catch (error) {
        console.error('Failed to fetch pins:', error);
    }
}

const loadPin = async () => {
    const url = "http://192.168.1.72:3000/api/pins";
    try {
        const pin = await Pin.fetch(url);
        return await pin;
    } catch (error) {
        0
        console.log(error);
    }
}

const initGallery = async () => {
    let photoGallery = document.getElementById("pin-section");
    let shoppingCart = document.getElementById("order-display");
    getCartFromCookies; // Update the shopping cart 
    // If there's a "pin-section" then we're on the designs page, so we do a gallery of designs.
    if (photoGallery !== null) {
        let pinArray = await loadPin();
        if (pinArray !== undefined && pinArray.length > 0) {
            pinArray.forEach((aPin) => {
                photoGallery.append(aPin.renderPinDesigns);
                //Add the "add to cart" button handler
                const buttons = document.querySelectorAll('button[id^="add-"]');
                buttons.forEach(button => {
                    button.onclick = addToCart;
                });
            })
        }
    }
    // If there's an order-display  then we're on the Shopping Cart Place order page.
    if (shoppingCart !== null) {
        let pinArray = await loadCart();
        if (pinArray !== undefined && pinArray.length > 0) {
            pinArray.forEach((aPin) => {
                shoppingCart.append(aPin.renderPinDesigns);
                //Add the "add to cart" button handler
                const buttons = document.querySelectorAll('button[id^="add-"]');
                buttons.forEach(button => {
                    button.onclick = addToCart;
                });
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

/* 
    We didn't cover cookies, so I had to research them. Cookies allow persistent data to stay on the client side.
    This will be used to set up the username and the shopping cart
*/

const setCookie = (name, value, days)  => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

const getCookie = (name) => {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

const deleteCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const getCartFromCookies = () => {
    const cartCookie = getCookie('shoppingCart');
    if (cartCookie) {
        return JSON.parse(cartCookie);
    }
    return [];
}

const addToCart = () => {
    const buttonId = this.id.substring(4); // Get the Button ID from the button ID.
    let cart = getCartFromCookies();

    // Check if the item already exists in the cart
    const existingItem = cart.find(item => item.id === buttonId);
    if (existingItem) {
        existingItem.quantity += 1; // Increment the quantity
    } else {
        // Add new item to the cart
        cart.push({ id: buttonId, quantity: 1 });
    }

    // Save the updated cart back to the cookies
    setCookie('shoppingCart', JSON.stringify(cart), 7); // Keeping the cookie for 7 days
}

const fetchCartDetails = () => {
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const productIds = cart.map(item => item.id);

    fetch('/api/getcart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds: productIds })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Cart details:', data);
        })
        .catch(error => console.error('Error fetching cart details:', error));
}

const setUsername = (e) => {
    const userNameInput = document.getElementById("txt-first-login");
    setCookie('username', userNameInput.value);
    userNameInput.readOnly = true;
}

window.onload = () => {
    initGallery();
    const userNameInput = document.getElementById("txt-first-login");
    document.getElementById("nav-toggle").onclick = toggleNav;
    
    if (getCookie("username")!= "") {
        userNameInput.value = getCookie("username");
        userNameInput.readOnly = true;
    } else {
        userNameInput.onchange = setUsername;
    }

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