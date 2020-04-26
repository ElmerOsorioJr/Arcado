var thumbUp = document.getElementsByClassName("thumbsUp");
var trash = document.getElementsByClassName("trash");
var commentTrash = document.getElementsByClassName("commentTrash");
var pin = document.getElementsByClassName("pin");
var edit = document.getElementById("bio");
var submitEdit = document.querySelector(".submit")


Array.from(pin).forEach(function(element) {
      element.addEventListener('click', function(){
        const imagePath = this.parentNode.parentNode.childNodes[3].pathname
        console.log(imagePath)
        fetch('pin', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          pinnedImage: imagePath
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

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const caption = this.parentNode.parentNode.childNodes[5].innerText
        let _id = this.parentNode.childNodes[9].dataset.id
        const likes = parseFloat(this.parentNode.childNodes[1].innerText)

        if(likes < 1){
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
      }
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const post = this.parentNode.parentNode.childNodes[5].innerText
        const likes = parseFloat(this.parentNode.childNodes[1].innerText)
        let pathName = this.parentNode.parentNode.childNodes[3].pathname
        let posterId= this.parentNode.childNodes[11].dataset.id
        let _id = this.parentNode.childNodes[9].dataset.id

        fetch('deletePost', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'posterId' : posterId,
            'pathName': pathName,
            'likes': likes,
            'post': post,
            '_id': _id
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});


Array.from(commentTrash).forEach(function(element) {
      element.addEventListener('click', function(){
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

  let replyButton = document.getElementById('replyButton')
  let deleteMessage = document.getElementById('deleteMessage')

  replyButton.addEventListener('click', () => {
    fetch('deleteMessage', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        senderId: recieverId,
        message: req.body.thisMessage
      })
    }).then(function (response) {
      window.location.reload()
    })
    })
