function tabUP() {
    const page = document.getElementById('page-numbers');
    // 清空之前可能存在的页码
    page.innerHTML = '';
    var startindex = seekindex - 3;
    if (startindex < 0) {
        startindex = 1;
    }
    var endindex = seekindex + 3;
    if (endindex > Allindex) {
        endindex = Allindex;
    }
    console.log(`总页数: ${Allindex}, 当前页码: ${seekindex}`)
    console.log(startindex, endindex);
    for (let i = startindex; i < endindex; i++) {
        // 创建一个新的 span 元素用于页码
        const pageNumber = document.createElement('button');
        pageNumber.className = 'page-number' + (i === seekindex?' active' : '');
        pageNumber.textContent = i; // 通常页码从 1 开始，所以这里加 1
        pageNumber.onclick = () => indexGO(i-1);
        pageNumber.id = i;
        // 将页码添加到页面中
        page.appendChild(pageNumber);
}
}
var Allindex
var seekindex
var viodeindex = 0;
function getdata() {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const response = await fetch('/system');
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const data = await response.json();
                console.log(data);
                Allindex = data.Allindex;
                seekindex = data.indexs;
                // alert(`Filepath: ${data.filepath}, Indexs: ${data.indexs}`);
                const videocenter = document.getElementById('video-gallery');
                for (let i = 0; i < data.filepath.length; i++) {
                    console.log(data.filepath[i]);
                    let videoContainer = document.createElement('div');
                    videoContainer.className = "video-item";
                    let strc = `/431960/${data.filepath[i][0]}`;
                    let videoHTML = `
                        <div class="video-wrapper">
                            <video class="video video-ongoing" src="${strc}" preload="none" poster="/431960/${data.filepath[i][1]}"></video>
                            <div class="video-overlay">
                                <div class="video-title">${data.filepath[i][0]}</div>
                                <div class="video-controls">
                                    <button class="play-pause-btn">▶</button>
                                    <input type="range" class="progress-bar" value="0">
                                    <span class="current-time">00:00</span>
                                    <span class="duration">00:00</span>
                                    <button class="fullscreen-btn">⛶</button>
                                </div>
                            </div>
                        </div>
                        <div class="video-controls-default">
                            <span class="video-title-edit">${data.filepath[i][0]}</span>
                            <button class="open-video-btn" data-video-src='/431960/${data.filepath[i][0]}' data-video-title="${viodeindex}">查看</button>
                            <button class="live-button" onclick="live('${data.filepath[i][0]},${data.filepath[i][1]}')">喜欢</button>
                            <button class="edit-button">修改</button>
                        </div>
                        <div class="video-controls-edit">
                            <form action="#" method="post" class="form-group">
                            <div class="from-div">
                                <input type="text" class="title-input inputname" name="newvideoname" placeholder="输入新标题">
                                <input type="hidden" value="${data.filepath[i][0]}" name="videoname" class="src">
                                <input type="hidden" value="${data.filepath[i][1]}" name="videogif">
                                <input type="hidden" value="" name="onname" class="onnamev">
                                </div>
                            </form>
                            <button class="delete-button" onclick="deldet('${data.filepath[i][0]}')">删除</button>
                            <button class="cancel-button">退出编辑</button>
                        </div>`;
                    videoContainer.innerHTML = videoHTML;
                    videocenter.appendChild(videoContainer);
                    inputSearch = data.inputSearch;
                    document.getElementById('uggestions-box').innerHTML = '';
                    for (let j = 0; j < inputSearch.length; j++) {
                        let inputSearchContainer = document.createElement('div');
                        inputSearchContainer.className = "suggestion-item";
                        inputSearchContainer.textContent = inputSearch[j];
                        inputSearchContainer.onclick = () => {searchVideo(inputSearch[j]);}
                        document.getElementById('uggestions-box').appendChild(inputSearchContainer);
                    }
                    viodeindex++;
                }
                editVideoName();
                resolve();  // 成功完成后解决Promise
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                reject(error);  // 失败时拒绝Promise
            }
        })();
    });
}

// (async () => {
//     try {
//         await getdata();
//         // 这里可以写getdata()完成后需要执行的代码
//         console.log('getdata() has completed.');
//     } catch (error) {
//         console.error('Error occurred while waiting for getdata():', error);
//     }
// })();
async function datainit() {
    try {
        // 等待 getdata() 完成
        await getdata();
        console.log('getdata() 已完成，继续执行后续代码');
        viode();
        inputstart();
        edit();
        addNewVideo();
        tabUP();
        bindVideoPlayerStart();
        // 在这里写后续代码
    } catch (error) {
        console.error('getdata() 执行失败:', error);
    }
}

// 调用初始化函数
datainit();



