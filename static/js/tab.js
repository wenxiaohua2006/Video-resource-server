// function tabBar() {
//     const contentContainer = document.getElementById('content');
//     const pageNumbersContainer = document.getElementById('page-numbers');
//     const firstPageButton = document.getElementById('first-page');
//     const prevPageButton = document.getElementById('prev-page');
//     const nextPageButton = document.getElementById('next-page');
//     const lastPageButton = document.getElementById('last-page');
//     const customPageInput = document.getElementById('custom-page');
//     const itemsPerPageInput = document.getElementById('items-per-page');
//     const showAllButton = document.getElementById('show-all');
//     const resetButton = document.getElementById('reset');

//     let currentPage = 1;
//     let itemsPerPage = 10;
//     let totalItems = 100; // 假设总共有 100 条数据
//     let totalPages = Math.ceil(totalItems / itemsPerPage);



//     // 更新分页按钮
//     function updatePagination() {
//         pageNumbersContainer.innerHTML = '';
//         const startPage = Math.max(1, currentPage - 2);
//         const endPage = Math.min(totalPages, currentPage + 2);

//         for (let i = startPage; i <= endPage; i++) {
//             const pageNumber = document.createElement('button');
//             pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
//             pageNumber.textContent = i;
//             pageNumber.addEventListener('click', () => goToPage(i));
//             pageNumbersContainer.appendChild(pageNumber);
//         }
//     }

//     // 跳转到指定页
//     function goToPage(page) {
//         if (page < 1 || page > totalPages) return;
//         currentPage = page;
//         updateContent();
//         updatePagination();
//     }

//     // 更新显示的内容
//     function updateContent() {
//         const start = (currentPage - 1) * itemsPerPage;
//         const end = start + itemsPerPage;
//         const items = Array.from(contentContainer.children);

//         items.forEach((item, index) => {
//             item.style.display = (index >= start && index < end) ? 'block' : 'none';
//         });
//     }

//     // 初始化
//     function init() {
//         updatePagination();
//         updateContent();
//     }

//     // 事件监听
//     firstPageButton.addEventListener('click', () => goToPage(1));
//     prevPageButton.addEventListener('click', () => goToPage(currentPage - 1));
//     nextPageButton.addEventListener('click', () => goToPage(currentPage + 1));
//     lastPageButton.addEventListener('click', () => goToPage(totalPages));

//     customPageInput.addEventListener('change', (e) => {
//         const page = parseInt(e.target.value);
//         if (!isNaN(page)) goToPage(page);
//     });

//     itemsPerPageInput.addEventListener('change', (e) => {
//         const value = parseInt(e.target.value);
//         if (!isNaN(value) && value > 0) {
//             itemsPerPage = value;
//             totalPages = Math.ceil(totalItems / itemsPerPage);
//             goToPage(1);
//         }
//     });

//     showAllButton.addEventListener('click', () => {
//         itemsPerPage = totalItems;
//         totalPages = 1;
//         goToPage(1);
//     });

//     resetButton.addEventListener('click', () => {
//         itemsPerPage = 10;
//         totalPages = Math.ceil(totalItems / itemsPerPage);
//         goToPage(1);
//         itemsPerPageInput.value = '';
//     });

//     init();
// }

// tabBar();

