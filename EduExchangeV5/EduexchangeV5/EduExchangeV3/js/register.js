var login = () => {
    window.location.assign("../html/login.html")
}

const Email= document.getElementById("Email")
const Username= document.getElementById("Username")
const Password= document.getElementById("Password")
const Message= document.getElementById("message")
const regex =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const signup= () => {
    if (Email.value === ""){
        Message.innerHTML = "Email is required"
        Message.style.color = "red"
    }else if  (Username.value === ""){
            Message.innerHTML = "Username is required"
            Message.style.color = "red"
        
    }else if  (Password.value === ""){
        Message.innerHTML = "Password is required"
        Message.style.color = "red"
    
    } else if (!Email.value.match(regex)) {
        Message.innerHTML = "Please Enter Valid Email Address"
        Message.style.color = "red"
    } else if (Password.value.length < 6) {
        Message.innerHTML = "Please Enter atleast 6 digit password"
        Message.style.color = "red"
    
    }else {
        firebase.auth().createUserWithEmailAndPassword(Email.value, Password.value)
  .then((userCredential) => {

   var d = new Date().toLocaleDateString();

   const userData = {
    Email: Email.value,
    Username: Username.value,
    Password: Password.value,
    ProfilePicture: "",
    Coverpicture: "",
    signupdate: `${d}`,
    uid: userCredential.user.uid,
   }

   firebase.firestore().collection("users").doc(userCredential.user.uid).set(userData).then((res) =>{
    Message.innerHTML= "Account was Successfully Created"
    Message.style.color= "Green"

    const user = firebase.auth().currentUser; 
    user.sendEmailVerification().then((res)=>{
        setTimeout(()=>{
         window.location.assign("../Main/emailverification.html")

        },2000)
       
    })
 
   })
  
   
  })
  .catch((error) => {
   Message.innerHTML = error.message;
   Message.style.color = "red"
   
  });
        
 }
}

