let alluser = [];
let userimg = document.getElementById("userimg");
let userprofileimg = document.getElementById("userprofileimg");
let usercoverimg = document.getElementById("usercoverimg");
let progressdiv = document.getElementById("progressbardiv");
let progressbar = document.getElementById("progressbar");
let isValidFileType = (file) => {return file.type.startsWith('image/')};


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            uid = user.uid;
            console.log("emailVerified true");
            var createpostinput = document.getElementById("user");
            firebase
                .firestore()
                .collection("users")
                .onSnapshot((result) => {
                    result.forEach((userData) => {
                        const userDataObj = userData.data();
                        console.log("userData:", userDataObj);
                        alluser.push(userDataObj);
                        if (userDataObj.uid === user.uid) {
                            createpostinput.setAttribute(
                                "placeholder",
                                `${" " + userDataObj.Username}`
                            );
                            document.querySelector('.profile .name').textContent = userDataObj.Username;
                            console.log("Profile picture URL:", userDataObj.ProfilePicture);
                            document.querySelector('.profile-details img').src = userDataObj.ProfilePicture;
                        }
                    });
                });
        }
    }
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            uid = user.uid;
            console.log("emailVerified true");
            var createpostinput = document.getElementById("user");
            var usernameElement = document.querySelector('.username');
            firebase
                .firestore()
                .collection("users")
                .onSnapshot((result) => {
                    result.forEach((userData) => {
                        const userDataObj = userData.data();
                        console.log("userData:", userDataObj);
                        alluser.push(userDataObj);
                        if (userDataObj.uid === user.uid) {
                            createpostinput.setAttribute(
                                "placeholder",
                                `${" " + userDataObj.Username}`
                            );
                            // Update the username in the HTML
                            usernameElement.textContent = userDataObj.Username;
                            console.log("Profile picture URL:", userDataObj.ProfilePicture);
                            document.querySelector('.profile-details img').src = userDataObj.ProfilePicture;
                        }
                    });
                });
        }
    }
});


let fileType = "";
let uid = "";
let allUsers = []; 

let changecoverpicture = (event) => {
    const file = event.target.files[0];
    if (isValidFileType(file)) {
        var uploadfile = firebase
            .storage()
            .ref()
            .child(`users/${uid}/coverpicture`).put(file);
        uploadfile.on(
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
                uploadfile.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    progressdiv.style.display = "none";
                    firebase.firestore().collection("users").doc(uid).update({
                        Coverpicture: downloadURL
                    })
                });
            }
        );
    } else {
        alert('Please select an image file.');
        event.target.value = ''; // Clear the input field
    }
};

let changeprofilepicture = (event) => {
    const file = event.target.files[0];
    if (isValidFileType(file)) {
        var uploadfile = firebase
            .storage()
            .ref()
            .child(`users/${uid}/profilepicture`).put(file);
        uploadfile.on(
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
                uploadfile.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    progressdiv.style.display = "none";
                    firebase.firestore().collection("users").doc(uid).update({
                        ProfilePicture: downloadURL
                    })
                });
            }
        );
    } else {
        alert('Please select an image file.');
        event.target.value = ''; // Clear the input field
    }
};

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            uid = user.uid;
            firebase.firestore().collection("users").onSnapshot((result) => {
                result.forEach((userData) => {
                    allUsers.push(userData.data());
                    fileType = userData.data().fileType;
                    if (userData.data().uid === user.uid) {
                        if (userData.data().ProfilePicture !== "" || userData.data().Coverpicture !== "") {
                            userprofileimg.setAttribute("src", userData.data().ProfilePicture || "https://t4.ftcdn.net/jpg/02/17/88/73/360_F_217887350_mDfLv2ootQNeffWXT57VQr8OX7IvZKvB.jpg");
                            usercoverimg.setAttribute("src", userData.data().Coverpicture || "https://nullchiropractic.com/wp-content/uploads/2017/11/profile-default-male-768x768.jpg");
                        }
                    }
                });
            });
        } else {
            setTimeout(() => {
                window.location.assign("../html/emailverification.html");
            });
        }
    } else {
        window.location.assign("../html/login.html");
    }
});

const log_out = () => {
    firebase.auth().signOut().then(() => {
      window.location.assign("./login.js")
    })
  }
  





