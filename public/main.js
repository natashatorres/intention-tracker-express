var heart = document.getElementsByClassName("fa-heart");
var trash = document.getElementsByClassName("fa-trash");


Array.from(heart).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].childNodes[0].innerText
        const tweet = this.parentNode.parentNode.childNodes[3].innerText
        const like = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        const id = this.parentNode.parentNode.childNodes[7].innerHTML

        console.log(name, tweet, like, id)

        fetch('tweet/like', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'like': like,
            'id': id
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});



Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const id = this.parentNode.parentNode.childNodes[7].innerText
        fetch('tweet', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'id': id
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
