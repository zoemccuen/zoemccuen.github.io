const slideImage = () => {
    const sliderImage = document.getElementById("image-changer-slide");
    const sliderValue = document.getElementById("slider-bar").value;
    sliderImage.setAttribute("src", "images/yoga" + sliderValue + ".jpg");
}

/* Function is called by clicking on navToggle and it checks to see what icon is in img. The if statement will ensure 
    that if closed, the open icon will load, if not then it will set the closed icon and toggle the hidden class on the menu.*/
const toggleMenu = () => {
    const navState = document.getElementById("menu-icon").src;
    if (navState.includes("images/menu-close")) {
        document.getElementById("menu-icon").setAttribute("src", "images/menu-open.png");
    } else {
        document.getElementById("menu-icon").setAttribute("src", "images/menu-close.png");
    }
    document.getElementById("main-nav").classList.toggle("hidden");
}

/* toggles first example and hides second */
const toggleCommandExample = () => {
    document.getElementById("example-command").classList.remove("hidden");
    document.getElementById("example-yoga").classList.add("hidden");
}

/* hides first example and shows second example */
const toggleSliderExample = () => {
    document.getElementById("example-command").classList.add("hidden");
    document.getElementById("example-yoga").classList.remove("hidden");
}

/* takes commands entered and turns them into the visual image changes depending on the char */

const commandImage = () => {
    const userInput = document.getElementById("command-box").value;

    /* Check for no input and return if true */
    if (userInput.trim() == "") {
        return false;
    }

    /* Creates the string to trigger the images */
    switch (userInput.slice(-1)) {
        case "b":
            document.getElementById("image-changer-type").setAttribute("src", "images/read.jpg");
            break;
        case "c":
            document.getElementById("image-changer-type").setAttribute("src", "images/clown.jpg");
            break;
        case "p":
            document.getElementById("image-changer-type").setAttribute("src", "images/birthday.jpg");
            break;
        case "r":
            document.getElementById("image-changer-type").setAttribute("src", "images/rain.jpg");
            break;
        case "s":
            document.getElementById("image-changer-type").setAttribute("src", "images/shovel.jpg");
            break;
        case "w":
            document.getElementById("image-changer-type").setAttribute("src", "images/work.jpg");
            break;
        default:
    }
}

/* Adds everything else after load complete */
window.onload = () => {
    document.getElementById("nav-command").onclick = toggleCommandExample;
    document.getElementById("nav-slider").onclick = toggleSliderExample;
    document.getElementById("slider-bar").oninput = slideImage;
    document.getElementById("nav-toggle").onclick = toggleMenu;
    document.getElementById("command-box").onkeyup = commandImage;
};