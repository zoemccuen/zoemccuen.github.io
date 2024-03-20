const showEmailResult = async (e) => {
    e.preventDefault();
    const result = document.getElementById("result");
    let response = await getEmailResult();
    if (response.status == 200) {
      result.innerHTML = "Thank you for your feedback!";
    } else {
      result.innerHTML = "Your feedback was unsuccessful, please try again!";
    }
  };
  
  const getEmailResult = async (e) => {
    const form = document.getElementById("design-form");
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    const result = document.getElementById("result");
    result.innerHTML = "Loading ...";
  
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });
      return response;
    } catch (error) {
      console.log(error);
      document.getElementById("result").innerHTML =
      "Your feedback was unsuccessful, please try again!";
    }

    setTimeout(() => {
        const result = document.getElementById('result');
      
        result.style.display = 'none';
      }, 2000);
  };
  
  document.getElementById("design-form").onsubmit = showEmailResult;