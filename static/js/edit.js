function edit() {
    const videoItems = document.querySelectorAll('.video-item');

    videoItems.forEach(videoItem => {
        const editButton = videoItem.querySelector('.edit-button');
        const cancelButton = videoItem.querySelector('.cancel-button');
        const defaultControls = videoItem.querySelector('.video-controls-default');
        const editControls = videoItem.querySelector('.video-controls-edit');
        const titleInput = videoItem.querySelector('.title-input');
        const videoTitle = videoItem.querySelector('.video-title');
        const deleteButton = videoItem.querySelector('.delete-button');
        const inputName = videoItem.querySelector('.inputname')
        const inputValue = videoItem.querySelector('.src');
        const onnames = videoItem.querySelector('.onnamev');
        // 点击修改按钮，切换到编辑状态
        editButton.addEventListener('click', () => {
            defaultControls.style.display = 'none';
            editControls.classList.add('active');
            // titleInput.value = videoTitle.textContent; // 将当前标题填充到输入框
            if (inputName) {
                console.log(inputValue.value);
                fetchValueByKey(inputValue.value).then(value => {
                    console.log(value);
                    inputName.value = value;
                    onnames.value = value;
                }).catch(error => {
                    console.error('Error fetching value:', error);
                    // 你可以在这里处理错误，比如显示一个错误消息给用户
                });
            }
        });

        // 点击退出编辑按钮，恢复到默认状态
        cancelButton.addEventListener('click', () => {
            editControls.classList.remove('active');
            defaultControls.style.display = 'flex';
        });

        // 点击删除按钮，删除视频（示例功能）
        deleteButton.addEventListener('click', () => {
            if (confirm('确定要删除这个视频吗？')) {
                videoItem.remove(); // 删除当前 video-item
                alert('视频已删除');
            }
        });

        // // 输入框失去焦点时更新标题
        // titleInput.addEventListener('blur', () => {
        //     if (titleInput.value.trim() !== '') {
        //         videoTitle.textContent = titleInput.value;
        //     }
        // });

        // // 按下回车键时更新标题
        // titleInput.addEventListener('keypress', (e) => {
        //     if (e.key === 'Enter' && titleInput.value.trim() !== '') {
        //         videoTitle.textContent = titleInput.value;
        //         editControls.classList.remove('active');
        //         defaultControls.style.display = 'flex';
        //     }
        // });
    });
}

async function fetchValueByKey(key) {
    const data = {
        type: "getname",
        key: key,
    };
    const jsonData = JSON.stringify(data);
 
    try {
        const response = await fetch('/JSONgetname', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData,
        });
 
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
 
        const result = await response.json();
        if (result !== undefined) {
            return result.name;
        } else {
            throw new Error('Unexpected response format');
        }
    } catch (error) {
        console.error('Error fetching value by key:', error);
        throw error; // 重新抛出错误，以便调用者可以处理它
    }
}

function sendJsons(key,value,videogif,onname) {
    const data = {
        type:"updata",
        key:key,
        value:value,
        videogif:videogif,
        onname:onname
    };
    const jsonData = JSON.stringify(data); // 将对象转换为JSON字符串  
    fetch('/systemctl', { // 发送POST请求到服务器上的某个端点  
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json' // 告诉服务器发送的是JSON数据  
        },
        body: jsonData // 发送JSON字符串  
    })  
    .then(response => response.json()) // 解析服务器的响应为JSON  
    .then(data => {
        console.log(data); // 在控制台中打印响应数据
    })
    .catch((error) => console.error('Error:', error)); // 捕获并打印错误
}


function addNewVideo() {
    console.log('add new video');
    var formContainers = document.querySelectorAll('.video-controls-edit form'); // 选择所有在.videodiv内的form元素
    formContainers.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            console.log('submitting form');
            event.preventDefault(); // 阻止表单的默认提交行为
            
            var formData = new FormData(form);
            var videoname = formData.get('videoname');
            var newvideoname = formData.get('newvideoname');
            var videogif = formData.get('videogif');
            var onname = formData.get('onname');
            // 发送数据到服务器（这里假设sendJsons是一个已经定义好的函数）
            sendJsons(videoname, newvideoname, videogif, onname);
        });
    });
}

function deldet(key) {
    const data = {
        type:"dateout",
        key:key
    };
    const jsonData = JSON.stringify(data); // 将对象转换为JSON字符串  
    fetch('/delete', { // 发送POST请求到服务器上的某个端点  
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json' // 告诉服务器发送的是JSON数据  
        },
        body: jsonData // 发送JSON字符串  
    })  
    .then(response => response.json()) // 解析服务器的响应为JSON  
    .then(data => {
        console.log(data); // 在控制台中打印响应数据
        if (data.status = "no"){
            alert("删除失败");
        }
    })
    .catch((error) => console.error('Error:', error)); // 捕获并打印错误
}