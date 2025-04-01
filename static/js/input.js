function inputstart() {
    const searchBox = document.querySelector('.search-box');
    const suggestionsBox = document.querySelector('.suggestions-box');

    // 点击搜索框时显示提示框
    searchBox.addEventListener('focus', () => {
        suggestionsBox.style.display = 'block';
    });

    // 点击其他地方时隐藏提示框
    document.addEventListener('click', (event) => {
        if (!searchBox.contains(event.target) && !suggestionsBox.contains(event.target)) {
            suggestionsBox.style.display = 'none';
        }
    });

    // 点击提示项时填充搜索框
    const suggestionItems = document.querySelectorAll('.suggestion-item');
    suggestionItems.forEach(item => {
        item.addEventListener('click', () => {
            searchBox.value = item.textContent;
            suggestionsBox.style.display = 'none';
        });
    });
}