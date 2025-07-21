// js/sidebar_logic.js

// 获取 URL 参数的辅助函数
// 参数：name - 要获取的参数名，url - 可选，要解析的URL字符串（默认为当前页面URL）
function getUrlParameter(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// 激活侧边栏链接和展开菜单的函数
function activateSidebarLinks() {
    console.log("activateSidebarLinks: 函数开始执行。");
    const currentPath = window.location.pathname.split('/').pop();
    console.log("activateSidebarLinks: 当前页面路径:", currentPath);

    const links = document.querySelectorAll('.sidebar-link');
    const detailsElements = document.querySelectorAll('.sidebar-details');

    // 首先，关闭所有 details 元素，确保每次都是干净的状态
    detailsElements.forEach(detail => {
        detail.removeAttribute('open');
    });
    console.log("activateSidebarLinks: 所有 details 元素已关闭。");


    links.forEach(link => {
        const linkHref = link.getAttribute('href');
        let linkPath = linkHref.split('?')[0].split('/').pop();
        let isActive = false;

        console.log(`activateSidebarLinks: 检查链接: ${linkHref}, 路径: ${linkPath}`);

        if (linkPath === currentPath) {
            if (currentPath === 'grammar_lessons.html') {
                // 对于语法学习页面，需要匹配章节参数
                const currentChapterParam = getUrlParameter('chapter');
                const linkChapterParam = getUrlParameter('chapter', linkHref);
                console.log(`  语法页面 - 当前章节: ${currentChapterParam}, 链接章节: ${linkChapterParam}`);
                if (linkChapterParam === currentChapterParam) {
                    isActive = true;
                }
            } else if (currentPath === 'vocabulary_lesson.html') {
                // 对于动态词汇学习页面 (卡片形式)，需要匹配书卷和章节参数
                const currentBookParam = getUrlParameter('book');
                const currentSectionParam = getUrlParameter('section');
                const linkBookParam = getUrlParameter('book', linkHref);
                const linkSectionParam = getUrlParameter('section', linkHref);

                console.log(`  词汇学习页面 (卡片) - 当前书卷: ${currentBookParam}, 章节: ${currentSectionParam}`);
                console.log(`  链接书卷: ${linkBookParam}, 章节: ${linkSectionParam}`);

                // 只有当 book 和 section 参数都匹配时才激活
                if (linkBookParam === currentBookParam && linkSectionParam === currentSectionParam) {
                    isActive = true;
                }
            } else if (currentPath === 'vocabulary_index.html') {
                // 对于词汇目录页面，如果当前页面就是 vocabulary_index.html (且没有book/section参数)，则激活它
                if (!getUrlParameter('book') && !getUrlParameter('section')) {
                    isActive = true;
                }
            } else {
                // 对于其他不带参数的页面 (如 homepage.html, greek_alphabet.html)
                isActive = true;
            }
        }

        if (isActive) {
            link.classList.add('active');
            console.log(`activateSidebarLinks: 链接被激活: ${linkHref}`);

            // 遍历所有父级 <details> 元素并展开它们
            let parentDetails = link.closest('.sidebar-details');
            while (parentDetails) {
                parentDetails.setAttribute('open', '');
                console.log(`activateSidebarLinks: 展开父级 details: ${parentDetails.id || parentDetails.className}`);
                // 移动到下一个父级 details 元素
                parentDetails = parentDetails.parentElement.closest('.sidebar-details');
            }
        } else {
            link.classList.remove('active');
        }
    });
    console.log("activateSidebarLinks: 函数执行完毕。");
}

// 将函数暴露到全局作用域，以便其他HTML文件可以调用
window.getUrlParameter = getUrlParameter;
window.activateSidebarLinks = activateSidebarLinks;
