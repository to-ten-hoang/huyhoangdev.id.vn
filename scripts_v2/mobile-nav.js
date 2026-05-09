// Mobile Navigation Handler - Xử lý menu trên mobile
class MobileNavigation {
  constructor() {
    this.menuButton = document.querySelector('button[aria-label="Menu"]');
    this.navLinks = document.querySelectorAll('nav a');
    this.isMenuOpen = false;
    this.isAnimating = false; // Flag to prevent rapid clicks
    this.mobileMenu = null;
    
    this.init();
  }

  init() {
    if (!this.menuButton) return;
    
    // Thêm event listener cho nút menu
    this.menuButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent bubbling to document
      this.toggleMenu();
    });
    
    // Thêm event listener cho các link ban đầu (desktop nav)
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isMenuOpen) this.closeMenu();
      });
    });
  }

  toggleMenu() {
    if (this.isAnimating) return;
    
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    // Thêm kiểm tra kỹ hơn để tránh kẹt trạng thái
    if (this.isMenuOpen) return;
    this.isAnimating = true;
    this.mobileMenu = document.createElement('div');
    this.mobileMenu.className = 'mobile-menu-overlay';
    this.mobileMenu.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 40;
      animation: fadeIn 0.3s ease-out;
    `;

    // Menu content
    const menuContent = document.createElement('div');
    menuContent.className = 'mobile-menu-content';
    menuContent.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      max-width: 300px;
      height: 100vh;
      background: linear-gradient(180deg, rgba(20, 20, 30, 0.95) 0%, rgba(15, 15, 25, 0.98) 100%);
      backdrop-filter: blur(10px);
      border-left: 1px solid rgba(16, 185, 129, 0.2);
      padding: 80px 24px 40px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 41;
      animation: slideInRight 0.3s ease-out;
      overflow-y: auto;
    `;

    // Navigation links
    this.navLinks.forEach(link => {
      const navLink = document.createElement('a');
      const rawHref = link.getAttribute('href');
      navLink.href = rawHref;
      navLink.textContent = link.textContent;
      navLink.style.cssText = `
        color: rgba(255, 255, 255, 0.7);
        padding: 12px 16px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        font-size: 16px;
        transition: all 0.3s ease;
        display: block;
      `;
      
      navLink.addEventListener('click', (e) => {
        if (rawHref && rawHref.startsWith('#')) {
          e.preventDefault();
          const targetId = rawHref.substring(1);
          const targetElement = document.getElementById(targetId || 'home');
          
          this.closeMenu();
          
          if (targetElement) {
            // Đợi menu bắt đầu đóng rồi mới cuộn mượt
            setTimeout(() => {
              targetElement.scrollIntoView({ behavior: 'smooth' });
              // Cập nhật hash thủ công để sync với logic active link của bạn
              window.location.hash = rawHref;
            }, 100);
          }
        } else {
          // Link ngoài hoặc link khác, vẫn đóng menu
          this.closeMenu();
        }
      });
      
      navLink.addEventListener('mouseover', function() {
        this.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        this.style.color = '#10b981';
      });
      
      navLink.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'transparent';
        this.style.color = 'rgba(255, 255, 255, 0.7)';
      });

      menuContent.appendChild(navLink);
    });

    // Download CV button
    const cvBtn = document.createElement('button');
    cvBtn.textContent = 'Tải CV';
    cvBtn.style.cssText = `
      background-color: #10b981;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      border: none;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s ease;
      text-align: center;
      display: block;
      margin-top: 12px;
      cursor: pointer;
    `;
    
    cvBtn.addEventListener('click', () => {
      if (typeof handleCVDownload === 'function') {
        handleCVDownload();
      }
      this.closeMenu();
    });
    
    cvBtn.addEventListener('mouseover', function() {
      this.style.backgroundColor = '#059669';
    });
    
    cvBtn.addEventListener('mouseout', function() {
      this.style.backgroundColor = '#10b981';
    });

    menuContent.appendChild(cvBtn);

    // Append to mobile menu
    this.mobileMenu.appendChild(menuContent);
    document.body.appendChild(this.mobileMenu);

    // Click on overlay to close
    this.mobileMenu.addEventListener('click', (e) => {
      if (e.target === this.mobileMenu) {
        this.closeMenu();
      }
    });

    // Body scroll lock
    document.body.style.overflow = 'hidden';

    // Add animations if not exists
    this.addAnimations();

    // Update button icon
    this.menuButton.innerHTML = '<i class="ri-close-line text-xl"></i>';
    this.isMenuOpen = true;

    // End animation state after transition
    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  closeMenu() {
    // Luôn cho phép đóng nếu menu đang mở, kể cả khi đang chạy hiệu ứng mở
    if (!this.isMenuOpen) return;
    this.isAnimating = true;

    if (!this.mobileMenu) {
      this.isMenuOpen = false;
      this.isAnimating = false;
      return;
    }

    // Animate out
    this.mobileMenu.style.animation = 'fadeOut 0.3s ease-out forwards';
    const menuContent = this.mobileMenu.querySelector('.mobile-menu-content');
    if (menuContent) {
      menuContent.style.animation = 'slideOutRight 0.3s ease-out forwards';
    }

    setTimeout(() => {
      if (this.mobileMenu && this.mobileMenu.parentNode) {
        this.mobileMenu.remove();
      }
      this.mobileMenu = null;
      // Body scroll unlock
      document.body.style.overflow = '';
      this.isAnimating = false;
    }, 300);

    // Update button icon
    this.menuButton.innerHTML = '<i class="ri-menu-line text-xl"></i>';
    this.isMenuOpen = false;
  }

  addAnimations() {
    if (!document.querySelector('#mobile-nav-animations')) {
      const style = document.createElement('style');
      style.id = 'mobile-nav-animations';
      style.innerHTML = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Khởi tạo an toàn
function initMobileNav() {
  if (window.mobileNavInstance) return;
  window.mobileNavInstance = new MobileNavigation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileNav);
} else {
  initMobileNav();
}
