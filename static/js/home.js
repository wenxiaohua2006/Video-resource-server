function liveMp4(cs,name,value,id){
    var data = {
        cs:cs,
        name:name,
        value:value
    };
    // 使用 fetch API 发送 POST 请求
    fetch('/system', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('成功:', data);
        if(data.code == 'ok'){
            let onlive = document.getElementById(id);
            onlive.innerText = '已喜欢';
            onlive.style.backgroundColor = 'red';
            onlive.onclick = () => {
                liveMp4('outlive',name,value,id)
            }
        }else if(data.code == 'okout'){
            if (data.state == 'no'){
                alert('移除可能失败')
            }
            let onlive = document.getElementById(id);
            onlive.innerText = '喜欢';
            onlive.style.backgroundColor = '#007bff';
            onlive.onclick = () => {
                liveMp4('live',name,value,id)
            }
        }
        // 在这里处理响应，比如跳转到下一页
    })
    .catch((error) => {
        console.error('错误:', error);
    });
}