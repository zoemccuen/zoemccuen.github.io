class Photo {
    constructor(source, pLink, attribution) {
        this.pLink = pLink;
        this.attribution = attribution;
        this.source = source;
    }

    get item() {
        const photoSection = document.createElement("section");
        photoSection.classList.add("photo");
        const photoImg = document.createElement("img");
        photoImg.src = this.source;
        photoImg.classList.add("photo-element");

        const creditLine = document.createElement("p");
        creditLine.classList.add("photo-link");
        creditLine.innerHTML = "<a href='" + this.pLink + "'>Image by " + this.attribution + "</a> on Freepik<p></p>";
        photoSection.appendChild(photoImg);
        photoSection.appendChild(creditLine);
        return photoSection;
    }
}

const initGallery = () => {
    let arrImage = [];
    let photoGallery = document.getElementById("image-gallery");

    arrImage.push(new Photo("images/mountain-lake.jpg", "https://www.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_40965130.htm#query=landscape&position=0&from_view=keyword&track=sph&uuid=8e520e53-3fb6-4e41-9da7-682c824a94f7", "vecstock"));
    arrImage.push(new Photo("images/golden.jpg", "https://www.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_11342065.htm#query=landscape&position=7&from_view=keyword&track=sph&uuid=16f8afcf-90c6-4cae-8249-a03fef90c6f4", "wirestock"));
    arrImage.push(new Photo("images/garden.jpg", "https://www.freepik.com/free-photo/amazing-shot-beautiful-butchart-gardens-brentwood-bay_20496783.htm#query=landscape&position=27&from_view=keyword&track=sph&uuid=16f8afcf-90c6-4cae-8249-a03fef90c6f4", "wirestock"));
    arrImage.push(new Photo("images/small-house.jpg", "https://www.freepik.com/free-photo/small-houses-green-field-with-dark-sky_7553929.htm#query=landscape&position=39&from_view=keyword&track=sph&uuid=16f8afcf-90c6-4cae-8249-a03fef90c6f4", "wirestock"));
    arrImage.push(new Photo("images/snow.jpg", "https://www.freepik.com/free-photo/beautiful-scenery-lot-leafless-trees-snow-covered-land-during-sunset_10990489.htm#query=landscape&position=38&from_view=keyword&track=sph&uuid=16f8afcf-90c6-4cae-8249-a03fef90c6f4", "wirestock"));

    for (let i in arrImage) {
        photoGallery.append(arrImage[i].item);
    }
}

const changeBanner = () => {
    const theBanner = document.querySelector(".banner-text");
    const styles = window.getComputedStyle(theBanner);
    let adCopy = [];
    adCopy.push("I love JS files");
    adCopy.push("Todays weather is sunny and 60s");
    adCopy.push("Dogs are the best!");
    adCopy.push("Poof Poof mange madame");
    adCopy.push("Happy Spring Break!");
    adCopy.push("I love HTML");
    let textIndex = parseInt(styles.getPropertyValue("--ad-number"), 10);    
    document.getElementById("banner").innerHTML = "<h4>" + adCopy[textIndex] + "</h4>";    
    textIndex ++;
    if (textIndex>5) {
        textIndex = 1;
    }
    theBanner.style.setProperty("--ad-number", textIndex);    
}

window.onload = () => {
    initGallery();
    changeBanner();
    setInterval(changeBanner,2000);
};
