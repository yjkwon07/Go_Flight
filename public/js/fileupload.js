if (document.getElementById('img')) {
    document.getElementById('img').addEventListener('change', function (e) {
        var xhr = new XMLHttpRequest();
        var check = document.getElementById('img-prev').value;
        var self = this;
        if(check) {
            xhr.onload = function () {
                if (xhr.status === 200) {
                    upload(self);
                } else {
                    console.error(xhr.responseText);
                }
            }; 
            xhr.open('DELETE', `/post${check}`);
            xhr.send();            
        }
        else {
            upload(self);
        }
    });
}

function upload(self) {
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    formData.append('img', self.files[0]);
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