// CV Download Handler - Xử lý download CV
function handleCVDownload(e) {
  if (e && e.preventDefault) e.preventDefault();
  showCVNotification();
}

function showCVNotification() {
  // Đảm bảo CSS được inject trước
  injectCVStyles();

  // Tìm hoặc tạo container cho notification
  let notificationContainer = document.getElementById('cv-notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'cv-notification-container';
    notificationContainer.className = 'cv-notif-overlay';
    document.body.appendChild(notificationContainer);
  }

  // Tạo backdrop (nền mờ)
  const backdrop = document.createElement('div');
  backdrop.className = 'cv-notif-backdrop';
  backdrop.id = 'cv-backdrop';
  document.body.appendChild(backdrop);

  // Tạo notification card
  const notification = document.createElement('div');
  notification.className = 'cv-notif-card';

  notification.innerHTML = `
    <div class="cv-notif-icon">📄</div>
    <h3 class="cv-notif-title">Hãy liên hệ với tôi</h3>
    <p class="cv-notif-text">
      Gửi email hoặc điền form liên hệ bên dưới để nhận CV của tôi. 
      Tôi sẽ gửi đầy đủ thông tin trong vòng 24 giờ.
    </p>
    <div class="cv-notif-actions">
      <button onclick="navigateToContact()" class="cv-notif-btn primary">
        Gửi Email
      </button>
      <button onclick="closeNotification()" class="cv-notif-btn secondary">
        Đóng
      </button>
    </div>
  `;

  notificationContainer.appendChild(notification);
  notificationContainer.style.display = 'flex';

  // Tắt notification khi click backdrop
  backdrop.addEventListener('click', closeNotification);
}

function injectCVStyles() {
  if (document.querySelector('#cv-notification-styles')) return;

  const style = document.createElement('style');
  style.id = 'cv-notification-styles';
  style.innerHTML = `
    .cv-notif-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2000;
      display: none;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .cv-notif-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 1999;
      animation: cvFadeIn 0.3s ease-out forwards;
    }
    .cv-notif-card {
      background: linear-gradient(135deg, rgba(20, 30, 48, 0.95) 0%, rgba(15, 25, 40, 0.98) 100%);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 20px;
      padding: 40px 32px;
      max-width: 450px;
      width: 90%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(12px);
      animation: cvPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      pointer-events: auto;
    }
    .cv-notif-icon {
      margin-bottom: 20px;
      font-size: 56px;
      filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.3));
    }
    .cv-notif-title {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 16px 0;
      letter-spacing: -0.02em;
    }
    .cv-notif-text {
      color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
      margin: 0 0 32px 0;
      line-height: 1.6;
    }
    .cv-notif-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cv-notif-btn {
      padding: 14px 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      border: none;
      width: 100%;
    }
    .cv-notif-btn.primary {
      background-color: #10b981;
      color: white;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
    }
    .cv-notif-btn.primary:hover {
      background-color: #059669;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
    }
    .cv-notif-btn.secondary {
      background-color: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .cv-notif-btn.secondary:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    /* Mobile Responsive */
    @media (max-width: 640px) {
      .cv-notif-card {
        padding: 32px 20px;
        width: 85%;
      }
      .cv-notif-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }
      .cv-notif-title {
        font-size: 20px;
        margin-bottom: 12px;
      }
      .cv-notif-text {
        font-size: 14px;
        margin-bottom: 24px;
      }
      .cv-notif-btn {
        padding: 12px 20px;
        font-size: 15px;
      }
    }

    @keyframes cvFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes cvFadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes cvPopIn {
      0% { opacity: 0; transform: scale(0.9) translateY(20px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

function closeNotification() {
  const backdrop = document.getElementById('cv-backdrop');
  const container = document.getElementById('cv-notification-container');
  
  if (backdrop) {
    backdrop.style.animation = 'cvFadeOut 0.3s ease-out forwards';
    setTimeout(() => backdrop.remove(), 300);
  }
  
  if (container) {
    const card = container.querySelector('.cv-notif-card');
    if (card) {
      card.style.animation = 'cvFadeOut 0.2s ease-out forwards';
    }
    setTimeout(() => {
      container.style.display = 'none';
      container.innerHTML = '';
    }, 300);
  }
}

function navigateToContact() {
  closeNotification();
  setTimeout(() => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 300);
}

// Khởi tạo an toàn
function initCVHandler() {
  if (window.cvHandlerInitialized) return;
  
  // Tìm tất cả các link/button Tải CV
  const allElements = document.querySelectorAll('a, button');
  allElements.forEach(el => {
    const text = el.textContent.toLowerCase();
    const href = el.getAttribute('href') || '';
    
    if (text.includes('tải cv') || text.includes('download cv') || 
        href.includes('drive.google.com') || href.includes('docs.google.com')) {
      el.addEventListener('click', function(e) {
        if (href.startsWith('http') || href.startsWith('#')) {
          e.preventDefault();
        }
        handleCVDownload();
      });
    }
  });
  
  window.cvHandlerInitialized = true;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCVHandler);
} else {
  initCVHandler();
}
