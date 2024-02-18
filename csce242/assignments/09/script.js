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

/* Loops */

/* clicker text and image relation */


/* Adds everything else after load complete */
window.onload = () => {
    document.getElementById("nav-command").onclick = toggleCommandExample;
    document.getElementById("nav-toggle").onclick = toggleMenu;
    document.getElementById("command-box").onkeyup = commandImage;
};