class Photo {
    constructor(source, attribution) {
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
        photoSection.appendChild(photoImg);
        photoSection.appendChild(creditLine);
        return photoSection;
    }
}

const initGallery = () => {
    let arrImage = [];
    let photoGallery = document.getElementById("image-gallery");

    arrImage.push(new Photo("images/apple.png", "Apple"));
    arrImage.push(new Photo("images/banana.png", "Banana"));
    arrImage.push(new Photo("images/orange.png", "Orange"));
    arrImage.push(new Photo("images/pineapple.png", "Pineapple"));
    arrImage.push(new Photo("images/kiwi.png", "Kiwi"));

    for (let i in arrImage) {
        photoGallery.append(arrImage[i].item);
    }
}

window.onload = () => {
    initGallery();
    changeBanner();
    setInterval(changeBanner,2000);
};
