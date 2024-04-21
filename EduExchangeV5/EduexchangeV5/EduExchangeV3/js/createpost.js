let postValue = document.getElementById("textarea");
let progressdiv = document.getElementById("progressdiv");
let progressbar = document.getElementById("progressbar");
let done = document.getElementById("done");
let currentUser = null;
let url = "";
let fileType = ""; 
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
  
  firebase.auth().onAuthStateChanged((user) => {
    currentUser = user;
});

let uploading = (event) => {
    fileType = event.target.files[0].type;
    
    if (!fileType.startsWith("image/")) {
        alert("Only image files are allowed.");
        return;
    }

    var uploadTask = firebase.storage().ref().child(`posts/${event.target.files[0].name}`).put(event.target.files[0]);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            var uploadpercentage = Math.round(progress);
            progressdiv.style.display = "block";
            progressbar.style.width = `${uploadpercentage}%`;
            progressbar.innerHTML = `${uploadpercentage}%`;
        },
        (error) => {
            console.error("Error uploading file: ", error);
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                url = downloadURL;
                done.style.display = "block";
                progressdiv.style.display = "none";
            });
        }
    );
};


var d = new Date().toLocaleDateString();

function createPost() {
  
    var postValue = document.getElementById("textarea").value;

    if (postValue !== "" || url !== "") {
        firebase.firestore().collection("posts").add({
            postValue: postValue,
            uid: currentUser.uid,
            url: url,
            fileType: fileType,
            like: "",
            dislike: "",
            comment: "",
            Date: `${d}`
        }).then((res) => {
            firebase.firestore().collection("posts").doc(res.id).update({
                id: res.id
            }).then(() => {
            
                done.style.display = "none";
                document.getElementById("uploadedmssage").style.display = "block";
                setTimeout(() => {
                    location.reload();
                }, 2000);
            });
        }).catch((error) => {
            console.error("Error creating post: ", error);
        });
    } else {
    
        console.log("PostValue and URL cannot be empty");
    }
};

const log_out = () => {
  firebase.auth().signOut().then(() => {
    window.location.assign("./login.js")
  })
}



  