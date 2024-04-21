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
                `${" " + userDataObj.Username}`
              );
              // Update the username and profile picture in the profile details
              document.querySelector('.profile .name').textContent = userDataObj.Username;
              console.log("Profile picture URL:", userDataObj.ProfilePicture);
              document.querySelector('.profile-details img').src = userDataObj.ProfilePicture;
            }
          });
        });

      //handles the search
      const handleSearch = () => {
        let filter = document.getElementById("searchInput").value.trim().toUpperCase();
        let posts = document.querySelectorAll(".postmain");

        posts.forEach((post) => {
          let postText = post.textContent.toUpperCase();
          if (postText.includes(filter)) {
            post.style.display = ""; // Show the post if it matches the search
          } else {
            post.style.display = "none"; // Hide the post if it doesn't match the search
          }
        });
      };

      document.getElementById("searchInput").addEventListener("input", handleSearch);



    } else {
      window.location.assign("./email.html");
    }
  } else {
    window.location.assign("./login.html");
  }
});



// get all post
var loading = document.getElementById("loaderdiv");
var showposts = document.getElementById("showposts");
firebase
  .firestore()
  .collection("posts")
  .onSnapshot((onSnapshot) => {
    loading.style.display = "none";
    let allposts = [];
    if (onSnapshot.size === 0) {
      let nodata = document.getElementById("h1");
      nodata.style.display = "block";
    } else {
      onSnapshot.forEach((postres) => {
        allposts.push(postres.data());
      });
      showposts.style.display = "block";
      showposts.innerHTML = "";
      for (let i = 0; i < allposts.length; i++) {
        let likearry = Array.isArray(allposts[i].like) ? allposts[i].like : [];
        let dislikearry = allposts[i].dislikes || [];
        let commentarry = allposts[i].comments || [];
        let postmain = document.createElement("div");
        showposts.appendChild(postmain);
        postmain.setAttribute("class", "postmain");
        //post header
        let postheader = document.createElement("div");
        postmain.appendChild(postheader);
        postheader.setAttribute("class", "postheader");
        // user data
        firebase
          .firestore()
          .collection("users")
          .doc(allposts[i].uid)
          .get()
          .then((res) => {
            // console.log(res);

            let userprodiv = document.createElement("div");

            let userprofileimage = document.createElement("img");

            postheader.appendChild(userprodiv);
            userprodiv.setAttribute("class", "userprodiv");
            userprodiv.appendChild(userprofileimage);
            userprofileimage.setAttribute(
              "src",
              res.data().ProfilePicture === ""
                ? "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651__340.png"
                : res.data().ProfilePicture
            );
            userprofileimage.setAttribute("class", "profileimage");
            let userdiv = document.createElement("div");
            userprodiv.appendChild(userdiv);
            let = username = document.createElement("h6");
            userdiv.appendChild(username);
            username.innerHTML = `${res.data().Username}`;

            let date = document.createElement("h6");
            userdiv.appendChild(date);
            date.innerHTML = `${allposts[i].Date} `;
            let postdetail = document.createElement("p");
            postheader.appendChild(postdetail);

            postdetail.innerHTML = allposts[i].postValue;
            if (allposts[i].url !== "") {
              if (
                allposts[i].fileType === "image/png" ||
                allposts[i].fileType === "image/jpg" ||
                allposts[i].fileType === "image/jpeg"
              ) {
                // images
                let postimage = document.createElement("img");
                postmain.appendChild(postimage);
                postimage.setAttribute("src", "");
                postimage.setAttribute("src", allposts[i].url);
                postimage.setAttribute("class", "postimage col-12");
              }
            }
            // footer
            let footerdiv = document.createElement("div");
            postmain.appendChild(footerdiv);
            footerdiv.setAttribute("class", "footerdiv");
            //like
            var likebutton = document.createElement("button");
            footerdiv.appendChild(likebutton);
            likebutton.setAttribute("class", "likebutton");
            likebutton.type = "button"; // Set button type to prevent form submission

            var likeicon = document.createElement("i");
            likebutton.appendChild(likeicon);
            likeicon.setAttribute("class", "bx bx-like");

            var liketitle = document.createElement("p");
            likebutton.appendChild(liketitle);
            liketitle.setAttribute("class", "impressionstitle");
            liketitle.innerHTML = `Like (${likearry.length})`;
            for (let likeIndex = 0; likeIndex < likearry.length; likeIndex++) {
              if (likearry[likeIndex] === uid) {
                likeicon.style.color = "#382769";
                liketitle.style.color = "#382769";
              }
            }
            //like function
            likebutton.addEventListener("click", (event) => {
              event.preventDefault(); // Prevent default behavior

              let like = false;
              for (
                let likeIndex = 0;
                likeIndex < likearry.length;
                likeIndex++
              ) {
                if (likearry[likeIndex] === uid) {
                  like = true;
                  likearry.splice(likeIndex, 1);
                }
              }
              if (!like) {
                likearry.push(uid);
              }
              firebase
                .firestore()
                .collection("posts/")
                .doc(allposts[i].id)
                .update({
                  like: likearry,
                });
            });

            var dislikebutton = document.createElement("button");
            footerdiv.appendChild(dislikebutton);
            dislikebutton.setAttribute("class", "bx bx-dislike");
            dislikebutton.type = "button"; // Set button type to prevent form submission

            var dislikeicon = document.createElement("i");
            dislikebutton.appendChild(dislikeicon);
            dislikeicon.setAttribute("class", "b");

            var disliketitle = document.createElement("p");
            dislikebutton.appendChild(disliketitle);
            disliketitle.setAttribute("class", "impressionstitle");
            disliketitle.innerHTML = `Dislike (${dislikearry.length})`;
            for (
              let dislikeindex = 0;
              dislikeindex < dislikearry.length;
              dislikeindex++
            ) {
              if (dislikearry[dislikeindex] === uid) {
                dislikeicon.style.color = "#382769";
                disliketitle.style.color = "#382769";
              }
            }
            dislikebutton.addEventListener("click", (event) => {
              event.preventDefault(); // Prevent default behavior

              let dislike = false;
              for (
                let dislikeindex = 0;
                dislikeindex < dislikearry.length;
                dislikeindex++
              ) {
                if (dislikearry[dislikeindex] === uid) {
                  dislike = true;
                  dislikearry.splice(dislikeindex, 1);
                }
              }
              if (!dislike) {
                dislikearry.push(uid);
              }
              firebase
                .firestore()
                .collection("posts/")
                .doc(allposts[i].id)
                .update({
                  dislikes: dislikearry,
                });
            });

            let commentbtn = document.createElement("button");
            footerdiv.appendChild(commentbtn);
            commentbtn.type = "button"; // Set button type to prevent form submission

            var commenticon = document.createElement("i");
            commentbtn.appendChild(commenticon);
            commenticon.setAttribute("class", "bx bx-comment");

            var commentmessage = document.createElement("p");
            commentbtn.appendChild(commentmessage);
            commentmessage.setAttribute("class", "impressionstitle");
            commentmessage.innerHTML = `Comment (${commentarry.length})`;
            // comment fuction
            if (commentarry.length !== 0) {
              for (
                var commentindex = 0;
                commentindex < commentarry.length;
                commentindex++
              ) {
                let commentmain = document.createElement("div");
                postmain.appendChild(commentmain);
                commentmain.setAttribute("class", "commentmain");
                let commentprofileimage = document.createElement("img");
                commentmain.appendChild(commentprofileimage);
                commentprofileimage.setAttribute(
                  "class",
                  "commentprofileimage"
                );
                var commentmessage = document.createElement("div");
                let commentusername = document.createElement("h6");
                commentmain.appendChild(commentmessage);
                commentmessage.appendChild(commentusername);
                //user data
                firebase
                  .firestore()
                  .collection("users")
                  .doc(commentarry[commentindex].uid)
                  .get()
                  .then((currentuserres) => {
                    commentprofileimage.setAttribute(
                      "src", "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651__340.png"
                    );
                    if (currentuserres.data().ProfilePicture !== "") {
                      commentprofileimage.setAttribute(
                        "src",
                        currentuserres.data().ProfilePicture
                      );
                    }
                    commentusername.innerHTML = `${currentuserres.data().Username
                      }`;
                  });
                let commentvalue = document.createElement("p");
                commentmessage.appendChild(commentvalue);
                commentvalue.innerHTML = commentarry[commentindex].commentvalue;
              }
            }
            let writecomment = document.createElement("div");
            writecomment.setAttribute("class", "writecomment");
            postmain.appendChild(writecomment);
            let commentinput = document.createElement("input");
            writecomment.appendChild(commentinput);
            commentinput.setAttribute("class", "commentinput");
            commentinput.setAttribute("placeholder", "Write Comment.....");
            let sendbutton = document.createElement("img");
            writecomment.appendChild(sendbutton);
            sendbutton.setAttribute("src", "https://cdn-icons-png.flaticon.com/512/3682/3682321.png");
            sendbutton.setAttribute("class", "sendbutton");

            //comment fuction
            sendbutton.addEventListener("click", (event) => {
              event.preventDefault(); // Prevent default behavior
              if (commentinput.value === "") {
                alert("Please write something.....!");
              } else {
                let commentdata = {
                  commentvalue: commentinput.value,
                  uid: uid,
                };
                commentarry.push(commentdata);
                firebase
                  .firestore()
                  .collection("posts")
                  .doc(allposts[i].id)
                  .update({
                    comments: commentarry,
                  });
              }
            });
          });
      }

    }
 
});

const log_out = () => {
  firebase.auth().signOut().then(() => {
    window.location.assign("./login.js")
  })
}
