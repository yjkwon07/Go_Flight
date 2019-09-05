document.querySelectorAll('.twit-follow').forEach(function (tag) {
    tag.addEventListener('click', function () {
        var isLoggedIn = document.querySelector('#my-id');
        if (isLoggedIn) {
            var userId = tag.parentNode.querySelector('.twit-user-id').value;
            var myId = isLoggedIn.value;
            if (userId !== myId) {
                if (confirm('팔로잉하시겠습니까?')) {
                    var xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            location.reload();
                        } else {
                            console.error(xhr.responseText);
                        }
                    };
                    xhr.open('POST', '/user/' + userId + '/follow');
                    xhr.send();
                }
            }
        }
    });
});

document.querySelectorAll('.twit-unfollow').forEach(function (tag) {
    tag.addEventListener('click', function () {
        var isLoggedIn = document.querySelector('#my-id');
        if (isLoggedIn) {
            var userId = tag.parentNode.querySelector('.twit-user-id').value;
            var myId = isLoggedIn.value;
            if (userId !== myId) {
                if (confirm('팔로우 끊으시겠습니까?')) {
                    var xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            location.reload();
                        } else {
                            console.error(xhr.responseText);
                        }
                    };
                    xhr.open('POST', '/user/' + userId + '/unfollow');
                    xhr.send();
                }
            }
        }
    });
});