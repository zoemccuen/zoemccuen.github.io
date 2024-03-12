const getHouse = async () => {
    const url = "https://portiaportia.github.io/json/house-plans.json";

    try {
        const response = await fetch(url);
        return await response.json();
    } catch(error) {
        console.log(error);
    }
};

const showHouse = async () => {
    let house = await getHouse();
    let houseSection = document.getElementById("house-section");

    house.forEach((house) => {
        houseSection.append(getHouseItem(house))
    });
};

const getHouseItem = (house) => {
    let section = document.createElement("section");

    let h3 = document.createElement("h3");
    h3.innerText = house.name;
    section.append(h3);

    let ul = document.createElement("ul");
    section.append(ul);
    ul.append(getLi(house.size));
    ul.append(getLi(house.bedrooms));
    ul.append(getLi(house.bathrooms));

    section.append(getFeatures(house.features));
    section.append(getImage(house.main_image));

    return section;
}

const getLi = data => {
    const li = document.createElement("li");
    li.textContent = data;
    return li;
};

const getFeatures = (features) => {
    const section = document.createElement("section");

    features.forEach((features) => {
        const p = document.createElement("p");
        p.textContent = features;
        section.append(p);
    });

    return section;
};

const getImage = (image) => {
    const section = document.createElement("section");

    features.forEach((image) => {
        const p = document.createElement("p");
        p.textContent = image;
        section.append(p);
    });

    return section;
};

window.onload = () => showHouse();