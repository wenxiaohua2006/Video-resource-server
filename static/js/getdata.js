function lazyLoadStary(){
    let lazyvideo=document.querySelectorAll("video");
    var indexs = 0
    function lazyLoad() {
        let scrollTop = document.getElementById("video-gallery").scrollTop; // 容器滚动过的距离
        let winHeight = document.getElementById("video-gallery").clientHeight; // 容器可视区域高度
        for (let i = indexs; i < lazyvideo.length; i++) {
            let rect = lazyvideo[i].getBoundingClientRect(); // 获取元素相对于视口的位置
            let elementTop = rect.top + scrollTop; // 计算元素相对于容器顶部的距离

            if (elementTop < scrollTop + winHeight + 200) {
                lazyvideo[i].poster = lazyvideo[i].getAttribute("data-src");
            } else {
                indexs = i;
                break;
            }
        }
    }
    var seton
    document.getElementById("video-gallery").addEventListener("scroll",function(){
        if (seton) {
            clearTimeout(seton); // 清除之前的定时器
        }
        seton = setTimeout(lazyLoad, 500); // 设置新的定时器
    })
    lazyLoad();
}
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
                Allindex = data.Allindex+2;
                seekindex = data.indexs;
                islive = data.islive;
                // alert(`Filepath: ${data.filepath}, Indexs: ${data.indexs}`);
                const videocenter = document.getElementById('video-gallery');
                let = viodeid = 0;
                for (let i = 0; i < data.filepath.length; i++) {
                    console.log(data.filepath[i]);
                    let videoContainer = document.createElement('div');
                    videoContainer.className = "video-item";
                    let strc = `/431960/${data.filepath[i][0]}`;
                    let ifliveadd = `<button class="live-button" id="live${viodeid}" onclick="liveMp4('live','${data.filepath[i][0]}','${data.filepath[i][1]}','live${viodeid}')">喜欢</button>`;
                    for (let j=0;j<data.islive.length;j++){
                        if(data.islive[j][0] == data.filepath[i][0]){
                            ifliveadd = `<button class="live-button" style="background-color: red;" id="live${viodeid}" onclick="liveMp4('outlive','${data.filepath[i][0]}','${data.filepath[i][1]}','live${viodeid}')">已喜欢</button>`;
                            break;
                        }
                    }
                    viodeid++;
                    let videoHTML = `
                        <div class="video-wrapper">
                            <video class="video video-ongoing" src="${strc}" preload="none" poster="/431960/start.gif" data-src="/431960/${data.filepath[i][1]}"></video>
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
                            <div class="video-controls-default-buttons">
                            <button class="open-video-btn" data-video-src='/431960/${data.filepath[i][0]}' data-video-title="${viodeindex}">查看</button>
                            ${ifliveadd}
                            <button class="edit-button">修改</button>
                            </div>
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
        lazyLoadStary();
        // 在这里写后续代码
    } catch (error) {
        console.error('getdata() 执行失败:', error);
    }
}

// 调用初始化函数
datainit();



