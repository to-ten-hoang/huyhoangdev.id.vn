// Email Handler - Xử lý gửi email
const GOOGLE_FORM_URL = 'https://script.google.com/macros/s/AKfycbztSskfz4iLkUh3WrHl9wZrQeP7Ku9Ho0xj691k_-KPGQo0q-CzPgdel1JhOnV7DRkb/exec';

// Toast notification
function showToast(message, type = 'success') {
  // Tìm hoặc tạo container cho toast
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(toastContainer);
  }

  // Tạo toast element
  const toast = document.createElement('div');
  const bgColor = type === 'success' ? '#10b981' : '#ef4444';
  const icon = type === 'success' ? '✓' : '✕';
  
  toast.style.cssText = `
    background-color: ${bgColor};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease-out;
    min-width: 250px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
  `;
  
  toast.innerHTML = `<span style="font-weight: bold; font-size: 18px;">${icon}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);

  // Tự động xóa sau 3 giây
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Loading spinner
function createLoadingSpinner() {
  const spinner = document.createElement('div');
  spinner.id = 'form-spinner';
  spinner.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  `;
  
  spinner.innerHTML = `
    <div style="
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-top: 4px solid #10b981;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    "></div>
    <p style="color: white; font-weight: 500;">Đang gửi...</p>
  `;

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
  `;
  if (!document.querySelector('#toast-animations')) {
    style.id = 'toast-animations';
    document.head.appendChild(style);
  }

  return spinner;
}

// Xử lý submit form
async function handleSubmit(e) {
  e.preventDefault();

  const form = document.getElementById('contact-form');
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const pesan = document.getElementById('pesan').value.trim();
  const submitBtn = form.querySelector('button[type="submit"]');

  // Validation
  if (!name || !email || !pesan) {
    showToast('Vui lòng điền đầy đủ thông tin', 'error');
    return;
  }

  // Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('Email không hợp lệ', 'error');
    return;
  }

  // Vô hiệu hóa button
  submitBtn.disabled = true;
  
  // Hiển thị spinner
  const spinner = createLoadingSpinner();
  document.body.appendChild(spinner);

  try {
    // Tạo FormData
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('pesan', pesan);
    formData.append('timestamp', new Date().toLocaleString('vi-VN'));

    // Gửi POST request
    const response = await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });

    // Xóa spinner
    spinner.remove();

    // Hiển thị thông báo thành công
    showToast('Cảm ơn! Tôi sẽ liên hệ với bạn sớm nhất', 'success');

    // Reset form
    form.reset();
    submitBtn.disabled = false;

  } catch (error) {
    // Xóa spinner
    spinner.remove();
    
    // Hiển thị thông báo lỗi
    showToast('✕ Có lỗi xảy ra. Vui lòng thử lại', 'error');
    submitBtn.disabled = false;

    console.error('Error:', error);
  }
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
});
