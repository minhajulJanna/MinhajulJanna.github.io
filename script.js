// DOM Elements
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const languageSelect = document.getElementById('language-select');
const installPrompt = document.getElementById('install-app');
const installButton = document.getElementById('install-button');
const dismissButton = document.getElementById('dismiss-button');

// Theme toggling functionality
function initThemeToggle() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', currentTheme === 'dark');
    document.body.classList.toggle('light-theme', currentTheme === 'light');

    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        document.body.classList.toggle('dark-theme', !isDark);
        document.body.classList.toggle('light-theme', isDark);
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
}

// Language switching functionality
function initLanguageSelect() {
    const currentLang = localStorage.getItem('language') || 'en';
    document.body.className = document.body.className.replace(/\b(en|ml|ar)\b/g, '') + ' ' + currentLang;
    languageSelect.value = currentLang;

    languageSelect.addEventListener('change', () => {
        const selectedLang = languageSelect.value;
        document.body.className = document.body.className.replace(/\b(en|ml|ar)\b/g, '') + ' ' + selectedLang;
        localStorage.setItem('language', selectedLang);
    });
}

// PWA installation
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show the install prompt after a short delay
    setTimeout(() => {
        if (localStorage.getItem('pwaInstallDismissed') !== 'true') {
            installPrompt.style.display = 'block';
        }
    }, 3000);
});

if (installButton) {
    installButton.addEventListener('click', async () => {
        // Hide our user interface that shows the install prompt
        installPrompt.style.display = 'none';
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        // We no longer need the prompt. Clear it up
        deferredPrompt = null;
    });
}

if (dismissButton) {
    dismissButton.addEventListener('click', () => {
        installPrompt.style.display = 'none';
        localStorage.setItem('pwaInstallDismissed', 'true');
    });
}

// Initialize functions on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    if (themeToggleBtn) {
        initThemeToggle();
    }

    // Initialize language
    if (languageSelect) {
        initLanguageSelect();
    }

    // Category filtering for videos page
    const categoryButtons = document.querySelectorAll('.category-btn');
    const videoItems = document.querySelectorAll('.video-item');
    
    if (categoryButtons.length > 0 && videoItems.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const category = button.getAttribute('data-category');
                
                // Show/hide videos based on category
                videoItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Tag filtering for articles page
    const tagButtons = document.querySelectorAll('.tag-btn');
    const articleCards = document.querySelectorAll('.article-card');
    
    if (tagButtons.length > 0 && articleCards.length > 0) {
        tagButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                tagButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const tag = button.getAttribute('data-tag');
                
                // Show/hide articles based on tag
                articleCards.forEach(card => {
                    const tags = card.getAttribute('data-tags');
                    if (tag === 'all' || tags.includes(tag)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Article search functionality
    const searchInput = document.getElementById('article-search');
    
    if (searchInput && articleCards) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            
            articleCards.forEach(card => {
                const title = card.querySelector('.article-title').textContent.toLowerCase();
                const excerpt = card.querySelector('.article-excerpt').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Load more videos
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // In a real implementation, this would load more videos from a server
            // For now, we'll just show a message
            loadMoreBtn.textContent = 'No more videos to load';
            loadMoreBtn.disabled = true;
        });
    }
});