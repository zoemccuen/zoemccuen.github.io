class House {
    constructor(name, size, bedrooms, bathrooms, features, main_image, floor_plans) {
        this.name = name;
        this.size = size;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.features = features;
        this.main_image = main_image;
        this.floor_plans = floor_plans;
    }

    static async fetch(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const houseData = await response.json();
            const house = houseData.map(houseData => {
                const {size, bedrooms, bathrooms, features} = houseData;
                return new House(size, bedrooms, bathrooms, features);
            });
            return house;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }
    
/* FIX THIS */
    get expandedSection() {        
        const photoSection = document.createElement("section");
        const target = "modal-" + this.name;        
        photoSection.classList.add("w3-modal");
        photoSection.id = target;

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("w3-modal-content");
        infoDiv.classList.add("expanded-info");

        const contentDiv = document.createElement("div");
 
        const photoImg = document.createElement("img");
        photoImg.src = this.source;
        photoImg.classList.add("photo-element-big");

        const textBox = document.createElement("div");
        textBox.classList.add("house-info");
        const heading = document.createElement("p");
        heading.innerText = this.name;
        heading.classList.add("house-heading");

        const houseFacts = document.createElement("p");
        const houseFactText =
                            "<p><b>Size:</b> " + this.size + "</p>" +
                            "<p><b>Bedrooms:</b> " + this.bedrooms + "</p>" +
                            "<p><b>Bathrooms:</b> " + this.bathrooms + "</p>" +
                            "<p><b>Features:</b> " + this.features + "</p>";

        houseFacts.innerHTML = houseFactText;
        textBox.appendChild(heading);
        textBox.appendChild(houseFacts);

        
        const imageBox = document.createElement("div");
        imageBox.classList.add("photo-big");    
        imageBox.appendChild(photoImg); 


        const infoCard = document.createElement("div");
        infoCard.classList.add("info-card");
        infoCard.appendChild(textBox);
        infoCard.appendChild(imageBox);

        contentDiv.appendChild(infoCard);

        infoDiv.appendChild(contentDiv);
        photoSection.appendChild(infoDiv);

        return photoSection;
    }

    get section() {
        const photoSection = document.createElement("section");
        photoSection.classList.add("photo");
        const target = "modal-" + this.name;
        photoSection.onclick = () => { modalOpen(target); };
        const photoImg = document.createElement("img");
        photoImg.src = this.source;        
        photoImg.classList.add("photo-element");
        const titleLine = document.createElement("p");
        titleLine.classList.add("photo-title");
        titleLine.innerText = this.name;
        photoSection.appendChild(titleLine);
        photoSection.appendChild(photoImg);
        return photoSection;
    }
}

const modalOpen = (theName) => {
    document.getElementById(theName).style.display = "block";
}

const loadHouse = async () => {
    const url = "https://portiaportia.github.io/json/house-plans.json" + new Date().getTime();
    try {
        const house = await House.fetch(url);
        return await house;
    } catch (error) {
        console.log(error);
    }
}

const initGallery = async () => {
    let houseArray = await loadHouse();
    let photoGallery = document.getElementById("image-gallery");

    if (houseArray !== undefined && houseArray.length > 0) {
        houseArray.forEach((aHouse) => {
            photoGallery.append(aHouse.section);
            photoGallery.append(aHouse.expandedSection);
        })
    }
}

window.onload = () => {
    initGallery();
};