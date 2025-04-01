function openVideoPlayer(id, videoSrc, title,buttonsDOM,index) {
    // 如果已经存在，则显示
    // if (videoPlayers[id]) {
    //     videoPlayers[id].style.display = 'block';
    //     return;
    // }

    // 创建视频播放器
    const videoPlayer = document.createElement('div');
    videoPlayer.className = 'video-player';
    videoPlayer.id = id;

    // 创建视频元素
    const video = document.createElement('video');
    video.src = videoSrc;
    video.controls = true;

    // 创建标题
    const videoTitle = document.createElement('div');
    videoTitle.className = 'video-title';
    videoTitle.textContent = title;

    // 将视频和标题添加到播放器中
    videoPlayer.appendChild(video);
    videoPlayer.appendChild(videoTitle);

    // 添加到页面
    document.body.appendChild(videoPlayer);

    // 显示播放器
    videoPlayer.style.display = 'block';

    // 存储播放器实例
    // videoPlayers[id] = videoPlayer;

    // 绑定点击外部隐藏事件
    let Listener
    Listener = document.addEventListener('click', function onClickOutside(event) {
        const isClickOnButton = event.target.classList.contains('open-video-btn');
        const isClickInsidePlayer = videoPlayer.contains(event.target);

        // 如果点击的是触发按钮或播放器内部，则不隐藏
        if (isClickOnButton || isClickInsidePlayer) {
            return;
        }

        // 否则隐藏播放器
        videoPlayer.remove();
        document.removeEventListener('click', Listener);
    });
    video.addEventListener('ended', function() {
        index++;
        if (index >= buttonsDOM.length) {
            index = 0;
        }
        let NewSrc = buttonsDOM[index].getAttribute('data-video-src');
        video.src = NewSrc;
        video.play();
        // 在这里执行视频播放完毕后的逻辑
    });
}

// 绑定按钮点击事件
function bindVideoPlayerStart() {
    var buttons = document.querySelectorAll('.open-video-btn');
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {
        const videoSrc = buttons[i].getAttribute('data-video-src');
        const videoTitle = buttons[i].getAttribute('data-video-title');
        const playerId = `video-player-${videoSrc}`; // 使用视频源作为唯一 ID

        openVideoPlayer(playerId, videoSrc, videoTitle,buttons,i);
    });
}
}