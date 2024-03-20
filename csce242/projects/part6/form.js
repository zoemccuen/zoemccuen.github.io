const submitEmail = (e) => {
    e.preventDefault();
    document.getElementById("results").classList.remove("hidden");
  
    const form = document.getElementById("form-email");
    const emailName = form.elements["email-name"].value;
    
     console.log(emailName);
  };
 

  document.getElementById("form-email").onsubmit = submitEmail;