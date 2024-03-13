class House {
    constructor(name, size, bedrooms, bathrooms, features, main_image, floor_plans) {
        this.name = name;
        this.size = size;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.features = features; // Array
        this.main_image = "https://portiaportia.github.io/json/images/house-plans/" + main_image;
        this.floor_plans = floor_plans // Array
    }

    static async fetch(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const houseData = await response.json();
            const house = houseData.map(houseData => {
                const { name, size, bedrooms, bathrooms, features, main_image, floor_plans } = houseData;
                return new House(name, size, bedrooms, bathrooms, features, main_image, floor_plans);
            });
            return house;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    get renderHouse() {
        // Make the main section to hold all the house info      
        const photoSection = document.createElement("section");
        photoSection.classList.add("main-house-section");

        // Make the div that holds the top part with the house info
        const houseBox = document.createElement("div");
        houseBox.classList.add("house-info"); // Flex container for top portion

        // Make the photo of the house - to the right and is 300px
        const photoImg = document.createElement("img");
        photoImg.src = this.main_image;
        photoImg.classList.add("photo-house");

        // Name of the house as a heading
        const heading = document.createElement("p");
        heading.innerText = this.name;
        heading.classList.add("house-heading");

        // Make div that holds the house photo and details (this is all the text and then the rest after)
        const houseFacts = document.createElement("div");
        const houseDetails = document.createElement("p");
        const houseFactText =
            "<p><b>Size:</b> " + this.size + "</p>" +
            "<p><b>Bedrooms:</b> " + this.bedrooms + "</p>" +
            "<p><b>Bathrooms:</b> " + this.bathrooms + "</p>" +
            "<p><b>Features:</b> " + this.features + "</p>";

        houseDetails.innerHTML = houseFactText;
        houseBox.appendChild(photoImg);
        houseFacts.appendChild(houseDetails);
        houseBox.appendChild(houseFacts);

        // Build the section which holds the floor plans. Should be flex to account for different #s of floors        
        const floorPlans = document.createElement("div");
        floorPlans.classList.add("floor-plans-container");
        this.floor_plans.forEach((floorElement) => {
            let floorDetail = document.createElement("div");
            floorDetail.classList.add("floor-plans");
            floorDetail.innerHTML = "<h3>" + floorElement.name + "</h3>";
            let floorImage = document.createElement("img");
            floorImage.classList.add("img-floor-plans");
            floorImage.src = "https://portiaportia.github.io/json/images/house-plans/" + floorElement.image;
            floorDetail.appendChild(floorImage);
            floorPlans.appendChild(floorDetail);
        });

        // creates the section with heading, house, floorPlans, and all info as an "info card" section
        const infoCard = document.createElement("div");
        infoCard.appendChild(heading);
        infoCard.appendChild(houseBox);
        infoCard.appendChild(floorPlans);
        photoSection.appendChild(infoCard);

        return photoSection;
    }
}

// adds everything together using the json url and returns the final products!
const loadHouse = async () => {
    const url = "https://portiaportia.github.io/json/house-plans.json?" + new Date().getTime();
    try {
        const house = await House.fetch(url);
        return await house;
    } catch (error) {
        console.log(error);
    }
}

// loads each aspect of the array to create the house and its other stuff
const initGallery = async () => {
    let houseArray = await loadHouse();
    let photoGallery = document.getElementById("house-section");

    if (houseArray !== undefined && houseArray.length > 0) {
        houseArray.forEach((aHouse) => {
            photoGallery.append(aHouse.renderHouse);
        })
    }
}

// loads everything up
window.onload = () => {
    initGallery();
};