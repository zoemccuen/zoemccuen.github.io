/* rotates image when using slider */
const rotateImage = () => {
    const movingImage = document.getElementById("image-rotator");
    const rotationValue = document.getElementById("slider-bar").value;
    movingImage.style.transform = 'rotate('+rotationValue+'deg)';
}

/* flips image when clicked */
const changeImage = () => {
    const currentCocky = document.getElementById("image-changer").src;    
    if (currentCocky.includes("jimi.png")) {        
        document.getElementById("image-changer").src="images/jimi_back.png";
    } else {
        document.getElementById("image-changer").src="images/jimi.png";
    }
}

/* adds star image when clicked */
const addStar = () => {    
    const starBox = document.getElementById("image-star");
    starBox.innerHTML =  starBox.innerHTML + "<div><img src='images/star.png' class='red-star'></div>";
}

/* loads additional functions on screen when triggered */
window.onload = () => {  
    document.getElementById("slider-bar").oninput = rotateImage;    
    document.getElementById("image-changer").onclick = changeImage;    
    document.getElementById("star-adder").onclick = addStar;    
};