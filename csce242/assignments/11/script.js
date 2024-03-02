/*
    Create a Tree class (or another topic), to hold all the information for a Tree, including:
        The image file name
        A get section method which returns only the title and the image for the object, formatted as an html section
        A get expandedSection method which returns all the information formatted as a section
    
    You may have helper methods to assist with organizing your code
    Create an array of at least 4 trees - add details as appropriate
    Save the images in an image folder so you can access them
    Loop through the trees, and add them to the DOM, use functions as appropriate
    Make sure everything is visually appealing, aligned correctly, all images the same size...
    If you struggle to get the modal dialog working, you can simply display the information on the page when clicked for partial marks.
*/

class Tree {
    constructor(name, source, treeType, growthRate, avgHeight, lifespan, habitat, description) {
        this.source = source;
        this.name = name;
        this.treeType = treeType;
        this.growthRate = growthRate;
        this.avgHeight = avgHeight;
        this.lifespan = lifespan;
        this.habitat = habitat;
        this.description = description;
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
                const { name, source, growthRate, avgHeight, lifespan, habitat, description } = treeData;
                return new Tree(name, source, growthRate, avgHeight, lifespan, habitat, description);
            });
            return trees;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    get section() {
        const photoSection = document.createElement("section");
        photoSection.classList.add("photo");
        const photoImg = document.createElement("img");
        photoImg.src = this.source;
        console.log(this.source);
        photoImg.classList.add("photo-element");

        const titleLine = document.createElement("p");
        titleLine.classList.add("photo-link");
        titleLine.innerText = this.name;        
        photoSection.appendChild(titleLine);
        photoSection.appendChild(photoImg);
        return photoSection;
    }
}

const loadTrees = async () => {
    const url = "trees.json?" + new Date().getTime();
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
        })
    }
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("Tree.json");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/* Put everything that will talk to elements on the page AFTER the load is complete */
window.onload = () => {
    initGallery();
};