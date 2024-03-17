const toggleNav = () => {
    document.getElementById("nav-menu").classList.toggle("hidden");    
}

window.onload = () => {
    document.getElementById("nav-toggle").onclick = toggleNav;
}