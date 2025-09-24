/**
 * QR Code Manager - Handles QR scanning and generation
 */
class QRManager {
  constructor() {
    this.video = null;
    this.canvas = null;
    this.context = null;
    this.stream = null;
    this.isScanning = false;
    this.flashEnabled = false;
    
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
  }

  setupElements() {
    this.video = document.getElementById('qr-video');
    this.canvas = document.getElementById('qr-canvas');
    
    if (this.canvas) {
      this.context = this.canvas.getContext('2d');
      this.canvas.width = 200;
      this.canvas.height = 200;
    }
  }

  setupEventListeners() {
    // QR Tab switching
    const qrTabs = document.querySelectorAll('.qr-tab');
    qrTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Flash toggle
    const flashBtn = document.getElementById('toggle-flash');
    if (flashBtn) {
      flashBtn.addEventListener('click', () => {
        this.toggleFlash();
      });
    }

    // Generate QR button
    const generateBtn = document.getElementById('generate-qr');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        this.generateQR();
      });
    }

    // Share QR button
    const shareBtn = document.getElementById('share-qr');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.shareQR();
      });
    }
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.qr-tab').forEach(tab => {
      tab.classList.remove('qr-tab--active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('qr-tab--active');

    // Update content
    document.querySelectorAll('.qr-content').forEach(content => {
      content.classList.remove('qr-content--active');
    });
    document.getElementById(`qr-${tabName}`).classList.add('qr-content--active');

    if (tabName === 'scan') {
      this.startScanning();
    } else {
      this.stopScanning();
    }
  }

  async startScanning() {
    if (this.isScanning) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (this.video) {
        this.video.srcObject = this.stream;
        this.isScanning = true;
        this.scanLoop();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      this.showNotification('Tidak dapat mengakses kamera', 'error');
    }
  }

  stopScanning() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isScanning = false;
  }

  scanLoop() {
    if (!this.isScanning) return;

    // Simulate QR detection (in real app, use QR library like jsQR)
    setTimeout(() => {
      if (Math.random() < 0.1) { // 10% chance to simulate QR detection
        this.handleQRDetected('UKI-WALLET-PAYMENT-12345');
      } else {
        this.scanLoop();
      }
    }, 100);
  }

  handleQRDetected(qrData) {
    this.stopScanning();
    
    // Parse QR data (simulate payment QR)
    if (qrData.includes('UKI-WALLET-PAYMENT')) {
      const paymentId = qrData.split('-').pop();
      this.showPaymentDialog(paymentId);
    } else {
      this.showNotification('QR Code tidak valid', 'error');
    }
  }

  showPaymentDialog(paymentId) {
    const amount = Math.floor(Math.random() * 500000) + 10000;
    const merchant = 'Toko ABC';
    
    const dialog = `
      <div class="payment-dialog">
        <h3>Konfirmasi Pembayaran</h3>
        <div class="payment-details">
          <p><strong>Merchant:</strong> ${merchant}</p>
          <p><strong>Jumlah:</strong> Rp ${this.formatCurrency(amount)}</p>
          <p><strong>ID:</strong> ${paymentId}</p>
        </div>
        <div class="payment-actions">
          <button class="btn btn--secondary" onclick="this.closest('.payment-dialog').remove()">Batal</button>
          <button class="btn btn--primary" onclick="window.qrManager.processPayment('${paymentId}', ${amount})">Bayar</button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', dialog);
  }

  processPayment(paymentId, amount) {
    // Simulate payment processing
    this.showNotification('Memproses pembayaran...', 'info');
    
    setTimeout(() => {
      this.showNotification(`Pembayaran Rp ${this.formatCurrency(amount)} berhasil!`, 'success');
      document.querySelector('.payment-dialog')?.remove();
    }, 2000);
  }

  toggleFlash() {
    if (!this.stream) return;

    const track = this.stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    
    if (capabilities.torch) {
      this.flashEnabled = !this.flashEnabled;
      track.applyConstraints({
        advanced: [{ torch: this.flashEnabled }]
      });
      
      const flashBtn = document.getElementById('toggle-flash');
      flashBtn.classList.toggle('btn--active', this.flashEnabled);
    }
  }

  generateQR() {
    if (!this.canvas || !this.context) return;

    // Get payment amount (simulate)
    const amount = Math.floor(Math.random() * 1000000) + 50000;
    const qrData = `UKI-WALLET-PAYMENT-${Date.now()}`;
    
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Generate simple QR pattern (in real app, use QR library)
    this.drawSimpleQR(qrData);
    
    // Update QR info
    document.querySelector('.qr-amount').textContent = `Rp ${this.formatCurrency(amount)}`;
    document.querySelector('.qr-description').textContent = 'Scan untuk membayar';
    
    this.showNotification('QR Code berhasil dibuat!', 'success');
  }

  drawSimpleQR(data) {
    const size = 200;
    const modules = 25;
    const moduleSize = size / modules;
    
    // Fill background
    this.context.fillStyle = '#FFFFFF';
    this.context.fillRect(0, 0, size, size);
    
    // Draw QR pattern (simplified)
    this.context.fillStyle = '#000000';
    
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        // Create pseudo-random pattern based on data
        const hash = this.simpleHash(data + i + j);
        if (hash % 2 === 0) {
          this.context.fillRect(
            i * moduleSize,
            j * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }
    
    // Draw finder patterns (corners)
    this.drawFinderPattern(0, 0, moduleSize);
    this.drawFinderPattern((modules - 7) * moduleSize, 0, moduleSize);
    this.drawFinderPattern(0, (modules - 7) * moduleSize, moduleSize);
  }

  drawFinderPattern(x, y, moduleSize) {
    // Outer square
    this.context.fillStyle = '#000000';
    this.context.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);
    
    // Inner white square
    this.context.fillStyle = '#FFFFFF';
    this.context.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
    
    // Center black square
    this.context.fillStyle = '#000000';
    this.context.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  shareQR() {
    if (!this.canvas) return;

    try {
      this.canvas.toBlob((blob) => {
        if (navigator.share) {
          const file = new File([blob], 'qr-code.png', { type: 'image/png' });
          navigator.share({
            title: 'QR Code Pembayaran',
            text: 'Scan QR code ini untuk melakukan pembayaran',
            files: [file]
          });
        } else {
          // Fallback: download image
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'qr-code.png';
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Error sharing QR:', error);
      this.showNotification('Gagal membagikan QR Code', 'error');
    }
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID').format(amount);
  }

  showNotification(message, type = 'info') {
    if (window.notificationManager) {
      window.notificationManager.show(message, type);
    } else {
      alert(message);
    }
  }
}

// Initialize QR Manager
document.addEventListener('DOMContentLoaded', function() {
  window.qrManager = new QRManager();
});