var thumbUp = document.getElementsByClassName("thumbsUp");
var commentTrash = document.getElementsByClassName("commentTrash");
// var commentInput = document.getElementsByClassName("commentInput");


// Array.from(commentInput).forEach(function(element) {
// element.addEventListener("keydown", function (e) {
//   if (e.keyCode === 13) {
//       //checks whether the pressed key is "Enter"
//       // let commentText = this.document.getElementsByClassName("comment").innerText
//       console.log(this.parentNode.childNodes)
//       console.log()
//       validate(e);
//     }
//   })
// });

// function validate(){
//   console.log("enter key is pressed")
// }





Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log(this.parentNode.childNodes)
        const caption = this.parentNode.parentNode.childNodes[5].innerText
        console.log(caption)
        let _id = this.parentNode.childNodes[5].dataset.id
        console.log(_id)
        const likes = parseFloat(this.parentNode.childNodes[1].innerText)
        console.log(likes)

        fetch('likePicture', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            '_id' : _id,
            'caption' : caption,
            'likes' : likes
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          window.location.reload(true)
        })
      });
});

Array.from(commentTrash).forEach(function(element) {
  console.log(commentTrash);
      element.addEventListener('click', function(){
        // console.log(this.parentNode.childNodes)
        const pictureId = this.parentNode.parentNode.childNodes[1].dataset.id
        const commentPosterId = this.parentNode.childNodes[1].dataset.id

        fetch('deleteComment', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'pictureId': pictureId,
            'commentPosterId': commentPosterId
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
