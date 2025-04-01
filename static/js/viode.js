function viode() {
    console.log('DOM fully loaded and parsed');
    const videos = document.querySelectorAll('.video');

    videos.forEach(video => {
        let isPlaying = false;
        let filename = video.getAttribute('src');
        const wrapper = video.parentElement;
        const overlay = wrapper.querySelector('.video-overlay');
        const playPauseBtn = overlay.querySelector('.play-pause-btn');
        const progressBar = overlay.querySelector('.progress-bar');
        const currentTime = overlay.querySelector('.current-time');
        const duration = overlay.querySelector('.duration');
        const fullscreenBtn = overlay.querySelector('.fullscreen-btn');

        let hideControlsTimeout;

        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                if (!isPlaying) {
                    isPlaying = true;
                    filehistory(filename);
                }
                playPauseBtn.textContent = '❚❚';
            } else {
                video.pause();
                playPauseBtn.textContent = '▶';
            }
            resetHideControlsTimeout(); // Reset timeout on user interaction
        });

        // video.addEventListener('click', () => {
        //     if (video.paused) {
        //         video.play();
        //         playPauseBtn.textContent = '❚❚';
        //     } else {
        //         video.pause();
        //         playPauseBtn.textContent = '▶';
        //     }
        //     resetHideControlsTimeout(); // Reset timeout on user interaction
        // });

        // Update progress bar and time
        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.value = progress;
            currentTime.textContent = formatTime(video.currentTime);
        });

        // Set video duration
        video.addEventListener('loadedmetadata', () => {
            duration.textContent = formatTime(video.duration);
        });

        // Seek functionality
        progressBar.addEventListener('input', () => {
            const seekTime = (progressBar.value / 100) * video.duration;
            video.currentTime = seekTime;
            resetHideControlsTimeout(); // Reset timeout on user interaction
        });

        // Fullscreen functionality
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                wrapper.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
            resetHideControlsTimeout(); // Reset timeout on user interaction
        });

        // Handle fullscreen change
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                // Start the timeout when entering fullscreen
                resetHideControlsTimeout();
            } else {
                // Clear timeout when exiting fullscreen
                clearTimeout(hideControlsTimeout);
                // Restore default behavior: hide controls when mouse leaves
                overlay.style.visibility = 'hidden';
                overlay.style.opacity = 0;
            }
        });

        // Hide controls after 3 seconds of inactivity in fullscreen
        function resetHideControlsTimeout() {
            if (document.fullscreenElement) {
                clearTimeout(hideControlsTimeout);
                hideControlsTimeout = setTimeout(() => {
                    overlay.style.visibility = 'hidden';
                    overlay.style.opacity = 0;
                }, 3000); // 3 seconds
            }
        }

        // Show controls on user interaction in fullscreen
        wrapper.addEventListener('mousemove', () => {
            // if (document.fullscreenElement) {
                overlay.style.visibility = 'visible';
                overlay.style.opacity = 1;
                resetHideControlsTimeout();
            // }
        });

        // Hide controls when mouse leaves the video wrapper (non-fullscreen)
        wrapper.addEventListener('mouseleave', () => {
            // if (!document.fullscreenElement) {
                overlay.style.visibility = 'hidden';
                overlay.style.opacity = 0;
            // }
        });

        // Format time helper function
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    });
}

function editVideoName(){
    var p = document.getElementsByClassName('video-title-edit');  
    for (var i = 0; i < p.length; i++) {  
        // 获取当前元素的innerHTML，分割字符串，并取最后一个部分  
        try{
           var parts = p[i].innerHTML.split('/');
           if (parts.length>1) {
        var lastPart = parts[parts.length - 1]; // 或者使用 parts.pop()，但注意pop会修改原数组  
      
        // 设置当前元素的innerHTML为最后一个部分  
        p[i].innerHTML = lastPart.slice(0,-4);}
        }catch{
            console.log("error");
        }
         
    }
}


function filehistory(name){
    // 收集你想要发送的数据
    var data = {
        filename:name
    };
    // 使用 fetch API 发送 POST 请求
    fetch('/filehistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('成功:', data);
    })
    .catch((error) => {
        console.error('错误:', error);
    });
}