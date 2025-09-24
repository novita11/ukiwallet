/**
 * Dashboard Manager - Handles analytics dashboard and charts
 */
class DashboardManager {
  constructor() {
    this.charts = {};
    this.data = {
      spending: [
        { category: 'Makanan', amount: 1500000, color: '#FFD700' },
        { category: 'Transport', amount: 800000, color: '#FFA500' },
        { category: 'Belanja', amount: 1200000, color: '#FF6B35' },
        { category: 'Hiburan', amount: 600000, color: '#FF4757' },
        { category: 'Lainnya', amount: 400000, color: '#747D8C' }
      ],
      monthlyTrend: [
        { month: 'Jan', income: 5000000, expense: 3500000 },
        { month: 'Feb', income: 5200000, expense: 3800000 },
        { month: 'Mar', income: 4800000, expense: 3200000 },
        { month: 'Apr', income: 5500000, expense: 4100000 },
        { month: 'May', income: 5300000, expense: 3900000 },
        { month: 'Jun', income: 5700000, expense: 4200000 }
      ],
      dailyActivity: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        transactions: Math.floor(Math.random() * 10) + 1,
        amount: Math.floor(Math.random() * 500000) + 100000
      }))
    };
    
    this.init();
  }

  init() {
    this.createDashboardPage();
    this.setupEventListeners();
  }

  createDashboardPage() {
    const dashboardHTML = `
      <!-- Dashboard Page -->
      <section class="page animate-fadeIn" id="page-dashboard">
        <div class="dashboard-header">
          <h2 class="page-title">Dashboard Analytics</h2>
          <div class="dashboard-period">
            <select id="period-selector" class="period-select">
              <option value="week">Minggu Ini</option>
              <option value="month" selected>Bulan Ini</option>
              <option value="year">Tahun Ini</option>
            </select>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="dashboard-summary stagger-item">
          <div class="summary-card card--animated">
            <div class="summary-icon">💰</div>
            <div class="summary-content">
              <div class="summary-value" id="total-income">Rp 5,700,000</div>
              <div class="summary-label">Total Pemasukan</div>
              <div class="summary-change text-success">+12.5%</div>
            </div>
          </div>
          
          <div class="summary-card card--animated">
            <div class="summary-icon">💸</div>
            <div class="summary-content">
              <div class="summary-value" id="total-expense">Rp 4,200,000</div>
              <div class="summary-label">Total Pengeluaran</div>
              <div class="summary-change text-danger">+8.3%</div>
            </div>
          </div>
          
          <div class="summary-card card--animated">
            <div class="summary-icon">📊</div>
            <div class="summary-content">
              <div class="summary-value" id="net-balance">Rp 1,500,000</div>
              <div class="summary-label">Saldo Bersih</div>
              <div class="summary-change text-success">+25.2%</div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <!-- Spending by Category -->
          <div class="chart-container card--animated stagger-item">
            <div class="chart-header">
              <h3 class="chart-title">Pengeluaran per Kategori</h3>
              <button class="chart-toggle" data-chart="spending">📊</button>
            </div>
            <div class="chart-content">
              <canvas id="spending-chart" width="300" height="200"></canvas>
              <div class="chart-legend" id="spending-legend"></div>
            </div>
          </div>

          <!-- Monthly Trend -->
          <div class="chart-container card--animated stagger-item">
            <div class="chart-header">
              <h3 class="chart-title">Tren Bulanan</h3>
              <button class="chart-toggle" data-chart="trend">📈</button>
            </div>
            <div class="chart-content">
              <canvas id="trend-chart" width="300" height="200"></canvas>
            </div>
          </div>

          <!-- Daily Activity -->
          <div class="chart-container card--animated stagger-item">
            <div class="chart-header">
              <h3 class="chart-title">Aktivitas Harian</h3>
              <button class="chart-toggle" data-chart="activity">📅</button>
            </div>
            <div class="chart-content">
              <canvas id="activity-chart" width="300" height="150"></canvas>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="quick-stats stagger-item">
          <div class="stat-grid">
            <div class="stat-item card--animated">
              <div class="stat-icon">🏆</div>
              <div class="stat-content">
                <div class="stat-value">156</div>
                <div class="stat-label">Total Transaksi</div>
              </div>
            </div>
            
            <div class="stat-item card--animated">
              <div class="stat-icon">⭐</div>
              <div class="stat-content">
                <div class="stat-value">1,250</div>
                <div class="stat-label">UKI Points</div>
              </div>
            </div>
            
            <div class="stat-item card--animated">
              <div class="stat-icon">🎯</div>
              <div class="stat-content">
                <div class="stat-value">85%</div>
                <div class="stat-label">Target Tercapai</div>
              </div>
            </div>
            
            <div class="stat-item card--animated">
              <div class="stat-icon">📱</div>
              <div class="stat-content">
                <div class="stat-value">24</div>
                <div class="stat-label">Hari Aktif</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Insert dashboard page after QR page
    const qrPage = document.getElementById('page-qr');
    if (qrPage) {
      qrPage.insertAdjacentHTML('afterend', dashboardHTML);
    }

    // Add dashboard navigation to bottom nav
    this.addDashboardNavigation();
  }

  addDashboardNavigation() {
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
      const dashboardNavHTML = `
        <button class="nav-item" data-page="dashboard">
          <div class="nav-icon">📊</div>
          <span class="nav-label">Dashboard</span>
        </button>
      `;
      
      // Insert before profile nav item
      const profileNav = bottomNav.querySelector('[data-page="profile"]');
      if (profileNav) {
        profileNav.insertAdjacentHTML('beforebegin', dashboardNavHTML);
      }
    }
  }

  setupEventListeners() {
    // Period selector
    const periodSelector = document.getElementById('period-selector');
    if (periodSelector) {
      periodSelector.addEventListener('change', (e) => {
        this.updateDashboard(e.target.value);
      });
    }

    // Chart toggles
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('chart-toggle')) {
        const chartType = e.target.dataset.chart;
        this.toggleChart(chartType);
      }
    });

    // Initialize charts when dashboard page is shown
    document.addEventListener('pageChanged', (e) => {
      if (e.detail.page === 'dashboard') {
        setTimeout(() => this.initializeCharts(), 100);
      }
    });
  }

  initializeCharts() {
    this.drawSpendingChart();
    this.drawTrendChart();
    this.drawActivityChart();
  }

  drawSpendingChart() {
    const canvas = document.getElementById('spending-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate total and angles
    const total = this.data.spending.reduce((sum, item) => sum + item.amount, 0);
    let currentAngle = -Math.PI / 2;

    // Draw pie slices
    this.data.spending.forEach((item, index) => {
      const sliceAngle = (item.amount / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      
      // Add stroke
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      currentAngle += sliceAngle;
    });

    // Update legend
    this.updateSpendingLegend();
  }

  updateSpendingLegend() {
    const legend = document.getElementById('spending-legend');
    if (!legend) return;

    const total = this.data.spending.reduce((sum, item) => sum + item.amount, 0);
    
    legend.innerHTML = this.data.spending.map(item => {
      const percentage = ((item.amount / total) * 100).toFixed(1);
      return `
        <div class="legend-item">
          <div class="legend-color" style="background-color: ${item.color}"></div>
          <div class="legend-content">
            <div class="legend-label">${item.category}</div>
            <div class="legend-value">Rp ${this.formatCurrency(item.amount)} (${percentage}%)</div>
          </div>
        </div>
      `;
    }).join('');
  }

  drawTrendChart() {
    const canvas = document.getElementById('trend-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const padding = 40;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find max value for scaling
    const maxValue = Math.max(
      ...this.data.monthlyTrend.map(d => Math.max(d.income, d.expense))
    );

    // Draw grid lines
    ctx.strokeStyle = '#E5E5E5';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw income line
    this.drawLine(ctx, this.data.monthlyTrend.map(d => d.income), maxValue, chartWidth, chartHeight, padding, '#FFD700', 'Pemasukan');
    
    // Draw expense line
    this.drawLine(ctx, this.data.monthlyTrend.map(d => d.expense), maxValue, chartWidth, chartHeight, padding, '#FF6B35', 'Pengeluaran');

    // Draw month labels
    ctx.fillStyle = '#666666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    this.data.monthlyTrend.forEach((item, index) => {
      const x = padding + (chartWidth / (this.data.monthlyTrend.length - 1)) * index;
      ctx.fillText(item.month, x, canvas.height - 10);
    });
  }

  drawLine(ctx, data, maxValue, chartWidth, chartHeight, padding, color, label) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = padding + chartHeight - (value / maxValue) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    ctx.fillStyle = color;
    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = padding + chartHeight - (value / maxValue) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  drawActivityChart() {
    const canvas = document.getElementById('activity-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const padding = 20;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxTransactions = Math.max(...this.data.dailyActivity.map(d => d.transactions));
    const barWidth = chartWidth / this.data.dailyActivity.length;

    // Draw bars
    this.data.dailyActivity.forEach((item, index) => {
      const barHeight = (item.transactions / maxTransactions) * chartHeight;
      const x = padding + index * barWidth;
      const y = padding + chartHeight - barHeight;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, '#FFD700');
      gradient.addColorStop(1, '#FFA500');

      ctx.fillStyle = gradient;
      ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
    });
  }

  toggleChart(chartType) {
    const button = document.querySelector(`[data-chart="${chartType}"]`);
    const container = button.closest('.chart-container');
    const content = container.querySelector('.chart-content');
    
    if (content.style.display === 'none') {
      content.style.display = 'block';
      button.textContent = '📊';
    } else {
      content.style.display = 'none';
      button.textContent = '👁️';
    }
  }

  updateDashboard(period) {
    // Simulate data update based on period
    this.showNotification(`Dashboard diperbarui untuk ${period}`, 'info');
    
    // Re-initialize charts with new data
    setTimeout(() => {
      this.initializeCharts();
    }, 500);
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID').format(amount);
  }

  showNotification(message, type = 'info') {
    if (window.notificationManager) {
      window.notificationManager.show(message, type);
    }
  }
}

// Initialize Dashboard Manager
document.addEventListener('DOMContentLoaded', function() {
  window.dashboardManager = new DashboardManager();
});