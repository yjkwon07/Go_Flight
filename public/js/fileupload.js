if (document.getElementById('img')) {
    document.getElementById('img').addEventListener('change', function (_event) {
        var xhr = new XMLHttpRequest();
        var filename = document.getElementById('img-prev').value;
        if(filename) {
            xhr.onload = function () {
                if (xhr.status === 200) {
                    upload(this.files[0]);
                } else {
                    console.error(xhr.responseText);
                }
            }; 
            xhr.open('DELETE', `/post${filename}`);
            xhr.send();            
        }
        else {
            upload(this.files[0]);
        }
    });
}

function upload(file) {
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    formData.append('img', file);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var url = JSON.parse(xhr.responseText).url;
            document.getElementById('img-url').value = url;
            document.getElementById('img-preview').src = url;
            document.getElementById('img-preview').style.display = 'inline';
            document.getElementById('img-prev').value = url;
        } else {
            console.error(xhr.responseText);
        }
    };
    xhr.open('POST', '/post/img');
    xhr.send(formData);
}