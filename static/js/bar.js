function darkedit(){
    let darkModeSwitch = document.getElementById('dark-mode');
    document.body.classList.toggle('dark-mode', darkModeSwitch.checked);
        // 假设 collapsibleSections 已经是所有需要切换暗模式的导航区块的集合
        // 如果不是，则需要通过某种方式获取这些元素，例如：
        let collapsibleSections = document.querySelectorAll('a');
        // 但注意，这里需要处理为数组或使用 Array.from 来遍历
        
        // 使用 forEach 遍历每个元素并切换暗模式类
        Array.from(collapsibleSections).forEach(section => {
            section.classList.toggle('dark-mode', darkModeSwitch.checked);
        });
        collapsibleSections = document.getElementsByClassName('nav-section');
        Array.from(collapsibleSections).forEach(section => {
            section.classList.toggle('dark-mode', darkModeSwitch.checked);
        });
        document.getElementById('side-nav').classList.toggle('dark-mode', darkModeSwitch.checked);
        document.getElementById('video-gallery').classList.toggle('dark-mode', darkModeSwitch.checked);
}

function bar() {
    const outbar = document.getElementById('outbar');
    const toggleButton = document.getElementById('toggle-button');
    const sideNav = document.getElementById('side-nav');
    const collapsibleSections = document.querySelectorAll('.collapsible');
    const darkModeSwitch = document.getElementById('dark-mode');
    const fontStyleSelect = document.getElementById('font-style');
    let darkMode = readDarkCookie();
    
    // 切换侧边导航栏
    toggleButton.addEventListener('click', () => {
        sideNav.classList.toggle('active');
    });

    outbar.addEventListener('click', () => {
        sideNav.classList.toggle('active');
    });

    // 切换可折叠部分
    collapsibleSections.forEach(section => {
        const header = section.querySelector('.nav-header');
        header.addEventListener('click', () => {
            section.classList.toggle('active');
        });
    });

    // 切换深色模式
    darkModeSwitch.addEventListener('change', () => {
        darkedit()
        setDarkCookie(darkModeSwitch.checked)
    });

    // 切换字体样式
    fontStyleSelect.addEventListener('change', () => {
        document.body.style.fontFamily = fontStyleSelect.value;
    });
    console.log('dark mode is set to ' + darkMode)
    if (darkMode == true) {
        darkModeSwitch.checked = true;
        console.log('dark mode is set')
        darkedit()
    }else{
        darkModeSwitch.checked = false;
        console.log('dark mode not set')
        darkedit()
    }
}

// 设置 Cookie
function setDarkCookie(value) {
    // 将值转换为字符串
    const cookieValue = `dark=${value}`;

    // 设置过期时间为 10 年后
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 10);

    // 设置 Cookie
    document.cookie = `${cookieValue}; expires=${expirationDate.toUTCString()}; path=/`;
    console.log(`Cookie set: ${cookieValue}`);
}

// 读取 Cookie
function readDarkCookie() {
    // 获取所有 Cookie
    const cookies = document.cookie.split(';');

    // 查找名为 dark 的 Cookie
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'dark') {
            console.log(`Dark Cookie value: ${value}`);
            return value === 'true';
        }
    }

    // 如果未找到 dark Cookie
    console.log('Dark Cookie not found');
    setDarkCookie(true);
}

bar();