if (document.getElementById('img')) {
    document.getElementById('img').addEventListener('change', function (e) {
        var formData = new FormData();
        //- console.log("img chage Listener: ", this, this.files);
        formData.append('img', this.files[0]);
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var url = JSON.parse(xhr.responseText).url;
                document.getElementById('img-url').value = url;
                document.getElementById('img-preview').src = url;
                document.getElementById('img-preview').style.display = 'inline';
            } else {
                console.error(xhr.responseText);
            }
        };
        xhr.open('POST', '/post/img');
        xhr.send(formData);
    });
}