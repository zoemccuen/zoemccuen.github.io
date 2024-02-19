/* When this function is called by click ing on the navToggle (the arrow in the drop down menu) it
   will check to see what icon is currently loaded into the img. If it's closed it will set it to
   the open icon, or else put it to closed icon. After that it toggles the class "hidden" on the
   menu itself 
*/
const toggleMenu = () => {
    const navState = document.getElementById("menu-icon").src;

    if (navState.includes("images/menu-close")) {
        document.getElementById("menu-icon").setAttribute("src", "images/menu-open.png");
    } else {
        document.getElementById("menu-icon").setAttribute("src", "images/menu-close.png");
    }

    document.getElementById("main-nav").classList.toggle("hidden");
}

/* Function to toggle if the first example is shown and the second hidden */
const toggleExample1 = () => {
    document.getElementById("example-1").classList.remove("hidden");
    document.getElementById("example-2").classList.add("hidden");

}

/* Function to hide the first example and show the second example */
const toggleExample2 = () => {
    document.getElementById("example-1").classList.add("hidden");
    document.getElementById("example-2").classList.remove("hidden");

}

const toggleBounce = () => {
    const bounceState = document.getElementById("toggle-ball");
    if (bounceState.innerHTML.includes("Start")) {
        bounceState.innerHTML = "Stop";
    } else {
        bounceState.innerHTML = "Start";
    }
}

const bounceBall = () => {
    const bounceState = document.getElementById("toggle-ball");
    if (bounceState.innerHTML.includes("Stop")) {
        const theBall = document.querySelector(".image-type-1");
        const styles = window.getComputedStyle(theBall);
        const ballY = parseInt(styles.getPropertyValue("margin-top"), 10);
        let vector = parseInt(styles.getPropertyValue("--ball-vector"), 10);
        if (ballY >= 280) {
            theBall.style.setProperty("--ball-vector", -vector);
            vector = -vector;
        }

        if (ballY <= 5 && vector < 0) {
            theBall.style.setProperty("--ball-vector", -vector);            
            document.getElementById("image-ball").style.marginTop = "0px";            
            toggleBounce();
        }

        document.getElementById("image-ball").style.marginTop = (ballY + vector) + "px";
        console.log(ballY + " " + vector);
    }
}


/* clicker text and image relation */
const addText = () => {
    const currentText = document.getElementById("image-changer").src;    
    if (currentText.includes("words")) {        
        document.getElementById("image-changer").src="text";
    } else {
        document.getElementById("image-changer").src="text";
    }
}


 /* Creates the string to trigger the images */
 $('DIV#images img').click(function () {
    $('DIV #text').html($(this).data('text'));
 });

/* Put everything that will talk to elements on the page AFTER the load is complete */
window.onload = () => {
    document.getElementById("nav-example1").onclick = toggleExample1;
    document.getElementById("nav-example2").onclick = toggleExample2;
    document.getElementById("nav-toggle").onclick = toggleMenu;
    document.getElementById("toggle-ball").onclick = toggleBounce;
    setInterval(bounceBall, 50);
};

