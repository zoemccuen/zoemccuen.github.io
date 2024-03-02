class Tree {
    constructor(name, source, treeType, growthRate, avgHeight, lifespan, habitat, description, treeID) {
        this.source = source;
        this.name = name;
        this.treeType = treeType;
        this.growthRate = growthRate;
        this.avgHeight = avgHeight;
        this.lifespan = lifespan;
        this.habitat = habitat;
        this.description = description;
        this.treeID = treeID;
    }

    /* Proud of this! It takes the url and loads JSON into an objects, setting the properties from
    the JSON. This way I don't have to have JSON in the script and can just iterated through array of objects/Trees */

    static async fetch(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const treesData = await response.json();
            const trees = treesData.map(treeData => {
                const { name, source, growthRate, treeType, avgHeight, lifespan, habitat, description, treeID } = treeData;
                return new Tree(name, source, treeType, growthRate, avgHeight, lifespan, habitat, description, treeID);
            });
            return trees;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    get expandedSection() {        
        const photoSection = document.createElement("section");
        const target = "modal-" + this.treeID;        
        photoSection.classList.add("w3-modal");
        photoSection.id = target;

        /* Add the main div which will contain the modal */
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("w3-modal-content");
        infoDiv.classList.add("expanded-info");

        /* Add the next div which will contain the Content of the modal */
        const contentDiv = document.createElement("div");
       // contentDiv.classList.add("w3-container");

        /* Add Close Button for Modal */
        const closeButton = document.createElement("span");
        closeButton.classList.add("w3-button");
        closeButton.classList.add("w3-display-topright");
        closeButton.classList.add("close-button");
        closeButton.onclick = () => { modalClose(target); };
        closeButton.innerHTML = "&times;";

        /* Create an image element for the tree */
        const photoImg = document.createElement("img");
        photoImg.src = this.source;
        photoImg.classList.add("photo-element-big");

        /* Create the text div and elements */
        const textBox = document.createElement("div");
        textBox.classList.add("tree-info");
        const heading = document.createElement("p");
        heading.innerText = this.name;
        heading.classList.add("tree-heading");

        const treeFacts = document.createElement("p");
        const treeFactText = "<p><b>Type:</b> " + this.treeType + "</p>" +
                            "<p><b>Growth Rate:</b> " + this.growthRate + "</p>" +
                            "<p><b>Height:</b> " + this.avgHeight + "</p>" +
                            "<p><b>LifeSpan:</b> " + this.lifespan + "</p>" +
                            "<p><b>Habitat:</b> " + this.habitat + "</p>" + 
                            "<p>" + this.description + "</p>";

        treeFacts.innerHTML = treeFactText;
        textBox.appendChild(heading); // Add Header to top of textBox
        textBox.appendChild(treeFacts); // Add the Tree Facts!

        
        /* Create the div that holds the image on the right side of the info card */
        const imageBox = document.createElement("div");
        imageBox.classList.add("photo-big");    
        imageBox.appendChild(photoImg); // Add the image to the imageBox
        

        /* Put close button into the container for the expanded info card */
        contentDiv.appendChild(closeButton);

        /* Create div to contain the expanded text and image */
        const infoCard = document.createElement("div");
        infoCard.classList.add("info-card");
        infoCard.appendChild(textBox);
        infoCard.appendChild(imageBox);

        /* Put InfoCard into the modal content under the close button */
        contentDiv.appendChild(infoCard);

        /* Add the inside stuff to the modal dialog */
        infoDiv.appendChild(contentDiv);
        photoSection.appendChild(infoDiv);

        return photoSection;
    }

    get section() {
        const photoSection = document.createElement("section");
        photoSection.classList.add("photo");
        const target = "modal-" + this.treeID;
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

const modalClose = (theName) => {
    document.getElementById(theName).style.display = "none";
}

const loadTrees = async () => {
    const url = "trees.json?" + new Date().getTime(); // Trick to get it to not cache the file
    try {
        const trees = await Tree.fetch(url);
        return await trees;
    } catch (error) {
        console.log(error);
    }
}

const initGallery = async () => {
    let treeArray = await loadTrees();
    let photoGallery = document.getElementById("image-gallery");

    if (treeArray !== undefined && treeArray.length > 0) {
        treeArray.forEach((aTree) => {
            photoGallery.append(aTree.section);
            photoGallery.append(aTree.expandedSection);
        })
    }
}


/* Put everything that will talk to elements on the page AFTER the load is complete */
window.onload = () => {
    initGallery();
};