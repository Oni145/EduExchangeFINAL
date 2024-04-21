const back = () => {
    window.location.assign("../html/login.html");
}

let email = document.getElementById("email");
let message = document.getElementById("message");

const reset = () => {
    if (email.value === "") {
        message.innerHTML = "Email Address is required";
        message.style.color = "red";
        email.focus();
    } else {
        firebase.auth().sendPasswordResetEmail(email.value)
        .then(() => {
            alert("reset link has been send on your email")
        })
        .catch((error) => {
            message.innerHTML = error.message;
            message.style.color = "red";
        });
    }
}
