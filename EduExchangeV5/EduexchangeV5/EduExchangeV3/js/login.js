var sign = () => {
    window.location.assign("../html/register.html")
  }
  const  Username = document.getElementById("Username")
  const Password = document.getElementById("Password")
  const  Message =document.getElementById ("message")
  
  const login = ()=>{
      if (Username.value===""){
          Message.innerHTML ="Email is required"
          Message.style.color= "red"
  
      }else if (Password.value===""){
          Message.innerHTML ="Password is required"
          Message.style.color= "red"
  } else {
      const userData = {
          Username: Username.value,
          Password: Password.value,
      }
      firebase.auth().signInWithEmailAndPassword(userData.Username, userData.Password)
    .then((userCredential) => {
      Message.innerHTML = "Sign in Sucessfully"
      Message.style.color = "green"
      if (userCredential.user.emailVerfied){
          window.location.assign("../html/homepage.html")
      
      } else  {
        window.location.assign ("../html/emailverification.html")
      }
     
      
    })
    .catch((error) => {
      Message.innerHTML = error.message;
    });
  
  }
  }
  
  const ForgetPassword = () => {
    window.location.assign("../html/forgotpassword.html")
  }
  
  
  
  