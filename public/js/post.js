document.querySelectorAll('.delete').forEach(function (tag) {
    tag.addEventListener('click', function () {
        var isLoggedIn = document.querySelector('#my-id');
        var twitId= document.querySelector('.twit-id').value;
        if (isLoggedIn) {
            var userId = tag.parentNode.querySelector('.twit-user-id').value;
            var myId = isLoggedIn.value;
            if(userId === myId){
                if(confirm('게시글을 삭제하시겠습니까?')){
                    var xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            location.reload();
                        } else {
                            console.error(xhr.responseText);
                        }
                    };
                    xhr.open('DELETE', '/post/' + twitId);
                    xhr.send();
                }
            }
        }
    });
});
