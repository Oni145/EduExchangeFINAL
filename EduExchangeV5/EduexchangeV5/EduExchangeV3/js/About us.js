let uid;
let alluser = [];
let userimg = document.getElementById("userimg");
let allposts;


firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    if (user.emailVerified) {
      uid = user.uid;
      console.log("emailVerified true");
      var createpostinput = document.getElementById("user");
      firebase
        .firestore()
        .collection("users/")
        .onSnapshot((result) => {
          result.forEach((userData) => {
            const userDataObj = userData.data();
            console.log("userData:", userDataObj);
            alluser.push(userDataObj);
            if (userDataObj.uid === user.uid) {
              createpostinput.setAttribute(
                "placeholder",
                `${" " + userDataObj.Username}` );
              document.querySelector('.profile .name').textContent = userDataObj.Username;
              console.log("Profile picture URL:", userDataObj.ProfilePicture);
              document.querySelector('.profile-details img').src = userDataObj.ProfilePicture;
            }
          });
        });
    } else {
      window.location.assign("../html/emailverification.html");
    }
  } else {
    window.location.assign("../html/login.html");
  }
});

// Handles the search
const handleSearch = () => {
  let filter = document.getElementById("searchInput").value.trim().toUpperCase();
  let posts = document.querySelectorAll(".users");

  posts.forEach((post) => {
    let postText = post.textContent.toUpperCase();
    if (postText.includes(filter)) {
      post.style.display = ""; // Show the post if it matches the search
    } else {
      post.style.display = "none"; // Hide the post if it doesn't match the search
    }
  });
};

const log_out = () => {
  firebase.auth().signOut().then(() => {
    window.location.assign("./login.js")
  })
}


