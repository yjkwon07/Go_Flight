document.querySelectorAll('.like').forEach(function (tag) {
    tag.addEventListener('click', function () {
        var isLoggedIn = document.querySelector('#my-id');
        var twitId= tag.parentNode.querySelector('.twit-id').value;
        if (isLoggedIn) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status === 200) {
                    location.reload();
                } else {
                    console.error(xhr.responseText);
                }
            };
            xhr.open('POST', '/post/' + twitId + '/like');
            xhr.send();
        }
    });
});

document.querySelectorAll('.unlike').forEach(function (tag) {
    tag.addEventListener('click', function () {
        var isLoggedIn = document.querySelector('#my-id');
        var twitId= tag.parentNode.querySelector('.twit-id').value;
        if (isLoggedIn) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status === 200) {
                    location.reload();
                } else {
                    console.error(xhr.responseText);
                }
            };
            xhr.open('DELETE', '/post/' + twitId + '/like');
            xhr.send();
        }
    });
});

