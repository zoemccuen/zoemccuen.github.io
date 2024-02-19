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

/* bounce toggle */
const toggleBounce = () => {
    const bounceState = document.getElementById("toggle-ball");
    if (bounceState.innerHTML.includes("Start")) {
        bounceState.innerHTML = "Stop";
    } else {
        bounceState.innerHTML = "Start";
    }
}

/* bounce */
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
            vector = -vector;
        }
        document.getElementById("image-ball").style.marginTop = (ballY + vector) + "px";
    }
}

/* Add an OnClick event dynamically */
const yogaInfo = () => {
    const yogaStyles = document.querySelectorAll("#yoga-fun img");
    for (let i = 0; i < yogaStyles.length; i++) {
        const currentItem = yogaStyles[i];                
        currentItem.setAttribute("onclick","toggleYoga(" + i + ")");
    }
}

const toggleYoga = (target) => {
    document.getElementById("yoga-" + target).classList.toggle("yoga-hidden");
}

/* add everything adds after load is complete */
window.onload = () => {
    document.getElementById("nav-example1").onclick = toggleExample1;
    document.getElementById("nav-example2").onclick = toggleExample2;
    document.getElementById("nav-toggle").onclick = toggleMenu;
    document.getElementById("toggle-ball").onclick = toggleBounce;
    yogaInfo();
    setInterval(bounceBall, 50);
};
