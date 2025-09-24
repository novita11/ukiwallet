// ===== MOBILE APP JAVASCRIPT =====

// App State
const appState = {
  balance: 2500000,
  points: 1250,
  tier: 'BASIC',
  currentPage: 'home'
};

// DOM Elements
const elements = {
  balanceText: document.getElementById('balanceText'),
  pointsText: document.getElementById('pointsText'),
  tierBadge: document.getElementById('tierBadge'),
  pages: document.querySelectorAll('.page'),
  navLinks: document.querySelectorAll('.mobile-nav__link'),
  actionButtons: document.querySelectorAll('[data-nav]')
};

// Utility Functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Analytics Functions
const updateAnalyticsData = (period = 'monthly') => {
  const data = getAnalyticsData(period);
  
  // Update summary cards with animation
  const incomeElement = document.querySelector('.summary-card:nth-child(1) .summary-value');
  const expenseElement = document.querySelector('.summary-card:nth-child(2) .summary-value');
  const netElement = document.querySelector('.summary-card:nth-child(3) .summary-value');
  
  if (incomeElement) animateCounter(incomeElement, 0, data.income, 1500);
  if (expenseElement) animateCounter(expenseElement, 0, data.expense, 1500);
  if (netElement) animateCounter(netElement, 0, data.net, 1500);
  
  // Update category breakdown
  const categoryItems = document.querySelectorAll('.category-item');
  categoryItems.forEach((item, index) => {
    if (data.categories[index]) {
      const categoryData = data.categories[index];
      
      // Update category name and amount
      const nameElement = item.querySelector('.category-name');
      const amountElement = item.querySelector('.category-amount');
      const progressBar = item.querySelector('.category-progress');
      const percentage = item.querySelector('.category-percentage');
      
      if (nameElement) nameElement.textContent = categoryData.name;
      if (amountElement) amountElement.textContent = formatCurrency(categoryData.amount);
      
      if (progressBar && percentage) {
        setTimeout(() => {
          progressBar.style.width = `${categoryData.percentage}%`;
          animateCounter(percentage, 0, categoryData.percentage, 1000, '%');
        }, 800 + (index * 100));
      }
    }
  });
  
  // Update monthly trends chart
  const chartBars = document.querySelectorAll('.chart-bar');
  chartBars.forEach((bar, index) => {
    const incomeBar = bar.querySelector('.bar-fill.income');
    const expenseBar = bar.querySelector('.bar-fill.expense');
    
    if (incomeBar && expenseBar && data.monthlyTrends[index]) {
      const incomeHeight = data.monthlyTrends[index].income;
      const expenseHeight = data.monthlyTrends[index].expense;
      
      setTimeout(() => {
        incomeBar.style.height = `${incomeHeight}%`;
        expenseBar.style.height = `${expenseHeight}%`;
      }, 1200 + (index * 150));
    }
  });
  
  // Update savings goal
  const goalFill = document.querySelector('.goal-fill');
  const goalCurrent = document.querySelector('.goal-current');
  const goalTarget = document.querySelector('.goal-target');
  
  if (goalFill && data.savingsGoal) {
    setTimeout(() => {
      goalFill.style.width = `${data.savingsGoal.percentage}%`;
    }, 1000);
  }
  
  if (goalCurrent && data.savingsGoal) {
    setTimeout(() => {
      animateCounter(goalCurrent, 0, data.savingsGoal.current, 1200);
    }, 1200);
  }
  
  if (goalTarget && data.savingsGoal) {
    goalTarget.textContent = formatCurrency(data.savingsGoal.target);
  }
  
  // Update quick stats
  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach((stat, index) => {
    if (data.quickStats[index]) {
      const statData = data.quickStats[index];
      setTimeout(() => {
        if (typeof statData.value === 'number' && statData.label.includes('Rata-rata')) {
          animateCounter(stat, 0, statData.value, 1000);
        } else if (typeof statData.value === 'number') {
          animateCounter(stat, 0, statData.value, 1000);
        } else {
          stat.textContent = statData.value;
        }
      }, 800 + (index * 200));
    }
  });
};

// Counter animation function
const animateCounter = (element, start, end, duration, suffix = '') => {
  const startTime = performance.now();
  const isRupiah = element.closest('.summary-value') || element.classList.contains('goal-current');
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = start + (end - start) * easeOutQuart;
    
    if (isRupiah) {
      element.textContent = formatCurrency(Math.floor(current));
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      // Ensure final value is exact
      if (isRupiah) {
        element.textContent = formatCurrency(end);
      } else {
        element.textContent = end + suffix;
      }
    }
  }
  
  requestAnimationFrame(updateCounter);
};

// Trigger animations when analytics page becomes visible
const initAnalyticsAnimations = () => {
  const analyticsPage = document.getElementById('page-analytics');
  if (!analyticsPage) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Reset all animations
        resetAnalyticsAnimations();
        
        // Trigger data update with animations
        setTimeout(() => {
          updateAnalyticsData();
        }, 300);
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(analyticsPage);
};

// Reset animations for re-triggering
const resetAnalyticsAnimations = () => {
  const animatedElements = document.querySelectorAll(`
    .summary-card,
    .analytics-card,
    .category-item,
    .chart-bar,
    .stat-card,
    .summary-label,
    .summary-value,
    .summary-change,
    .card-title,
    .chart-toggle,
    .category-percentage,
    .bar-label,
    .chart-legend,
    .goal-info,
    .goal-stats
  `);
  
  animatedElements.forEach(element => {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = null;
  });
  
  // Reset progress bars
  const progressBars = document.querySelectorAll('.category-progress, .goal-fill');
  progressBars.forEach(bar => {
    bar.style.width = '0';
  });
  
  // Reset chart bars
  const chartBars = document.querySelectorAll('.bar-fill');
  chartBars.forEach(bar => {
    bar.style.height = '0';
  });
};

const getAnalyticsData = (period) => {
  const baseData = {
    weekly: {
      income: 2150000,
      expense: 1350000,
      net: 800000,
      categories: [
        { name: 'Makanan & Minuman', amount: 850000, percentage: 35.2, icon: '🍔' },
        { name: 'Transportasi', amount: 550000, percentage: 22.9, icon: '🚗' },
        { name: 'Belanja', amount: 435000, percentage: 18.1, icon: '🛒' },
        { name: 'Hiburan', amount: 345000, percentage: 14.3, icon: '🎬' },
        { name: 'Tagihan', amount: 230000, percentage: 9.5, icon: '⚡' }
      ],
      monthlyTrends: [
        { month: 'Jan', income: 45, expense: 30 },
        { month: 'Feb', income: 55, expense: 40 },
        { month: 'Mar', income: 65, expense: 50 },
        { month: 'Apr', income: 50, expense: 35 },
        { month: 'Mei', income: 70, expense: 55 },
        { month: 'Jun', income: 75, expense: 60 }
      ],
      quickStats: [
        { label: 'Total Transaksi', value: 67, icon: '📊' },
        { label: 'Rata-rata Transaksi', value: 32150, icon: '💳' },
        { label: 'Kategori Terfavorit', value: 'Makanan', icon: '🏆' }
      ],
      savingsGoal: {
        current: 1250000,
        target: 5000000,
        percentage: 25
      }
    },
    monthly: {
      income: 8750000,
      expense: 5250000,
      net: 3500000,
      categories: [
        { name: 'Makanan & Minuman', amount: 1850000, percentage: 35.2, icon: '🍔' },
        { name: 'Transportasi', amount: 1200000, percentage: 22.9, icon: '🚗' },
        { name: 'Belanja', amount: 950000, percentage: 18.1, icon: '🛒' },
        { name: 'Hiburan', amount: 750000, percentage: 14.3, icon: '🎬' },
        { name: 'Tagihan', amount: 500000, percentage: 9.5, icon: '⚡' }
      ],
      monthlyTrends: [
        { month: 'Jan', income: 60, expense: 40 },
        { month: 'Feb', income: 75, expense: 55 },
        { month: 'Mar', income: 85, expense: 65 },
        { month: 'Apr', income: 70, expense: 50 },
        { month: 'Mei', income: 90, expense: 70 },
        { month: 'Jun', income: 95, expense: 75 }
      ],
      quickStats: [
        { label: 'Total Transaksi', value: 247, icon: '📊' },
        { label: 'Rata-rata Transaksi', value: 21255, icon: '💳' },
        { label: 'Kategori Terfavorit', value: 'Makanan', icon: '🏆' }
      ],
      savingsGoal: {
        current: 4750000,
        target: 10000000,
        percentage: 47.5
      }
    },
    yearly: {
      income: 105000000,
      expense: 63000000,
      net: 42000000,
      categories: [
        { name: 'Makanan & Minuman', amount: 22200000, percentage: 35.2, icon: '🍔' },
        { name: 'Transportasi', amount: 14430000, percentage: 22.9, icon: '🚗' },
        { name: 'Belanja', amount: 11403000, percentage: 18.1, icon: '🛒' },
        { name: 'Hiburan', amount: 9009000, percentage: 14.3, icon: '🎬' },
        { name: 'Tagihan', amount: 5985000, percentage: 9.5, icon: '⚡' }
      ],
      monthlyTrends: [
        { month: 'Jan', income: 65, expense: 45 },
        { month: 'Feb', income: 70, expense: 50 },
        { month: 'Mar', income: 80, expense: 60 },
        { month: 'Apr', income: 75, expense: 55 },
        { month: 'Mei', income: 85, expense: 65 },
        { month: 'Jun', income: 90, expense: 70 }
      ],
      quickStats: [
        { label: 'Total Transaksi', value: 2847, icon: '📊' },
        { label: 'Rata-rata Transaksi', value: 36875, icon: '💳' },
        { label: 'Kategori Terfavorit', value: 'Makanan', icon: '🏆' }
      ],
      savingsGoal: {
        current: 28500000,
        target: 50000000,
        percentage: 57
      }
    }
  };
  
  return baseData[period] || baseData.monthly;
};

const formatPoints = (points) => {
  return `${points.toLocaleString('id-ID')} pts`;
};

// Navigation Functions
const showPage = (pageId) => {
  // Hide all pages
  elements.pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show target page
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add('active');
    appState.currentPage = pageId;
  }
  
  // Update navigation
  updateNavigation(pageId);
};

const updateNavigation = (activePageId) => {
  elements.navLinks.forEach(link => {
    const navTarget = link.getAttribute('data-nav');
    if (navTarget === activePageId) {
      link.classList.add('mobile-nav__link--active');
    } else {
      link.classList.remove('mobile-nav__link--active');
    }
  });
};

// Render Functions
const render = () => {
  if (elements.balanceText) {
    elements.balanceText.textContent = appState.balance.toLocaleString('id-ID');
  }
  
  if (elements.pointsText) {
    elements.pointsText.textContent = appState.points.toLocaleString('id-ID');
  }
  
  if (elements.tierBadge) {
    elements.tierBadge.textContent = `TIER ${appState.tier}`;
  }
};

// Event Listeners
const initEventListeners = () => {
  // Navigation links
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-nav');
      if (target) {
        showPage(target);
      }
    });
  });
  
  // Action buttons
  elements.actionButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const target = button.getAttribute('data-nav');
      if (target) {
        showPage(target);
      }
    });
  });
  
  // Balance toggle functionality
  const balanceToggle = document.getElementById('balance-toggle');
  const balanceAmount = document.getElementById('balance-amount');
  let isBalanceHidden = false;
  
  if (balanceToggle && balanceAmount) {
    balanceToggle.addEventListener('click', (e) => {
      e.preventDefault();
      isBalanceHidden = !isBalanceHidden;
      
      const amountElement = balanceAmount.querySelector('.amount');
      const toggleIcon = balanceToggle.querySelector('.toggle-icon');
      
      if (isBalanceHidden) {
        // Hide balance
        amountElement.textContent = '••••••••';
        toggleIcon.textContent = '🙈';
        balanceToggle.setAttribute('aria-label', 'Tampilkan saldo');
      } else {
        // Show balance
        amountElement.textContent = appState.balance.toLocaleString('id-ID');
        toggleIcon.textContent = '👁️';
        balanceToggle.setAttribute('aria-label', 'Sembunyikan saldo');
      }
      
      // Add animation effect
      amountElement.style.transform = 'scale(0.95)';
      setTimeout(() => {
        amountElement.style.transform = 'scale(1)';
      }, 150);
    });
  }
  
  // Handle back button
  window.addEventListener('popstate', (e) => {
    const page = e.state?.page || 'home';
    showPage(page);
  });
  
  // Initialize analytics animations
  initAnalyticsAnimations();
  
  // Period selector functionality for analytics
  const periodButtons = document.querySelectorAll('.period-btn');
  periodButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      periodButtons.forEach(b => b.classList.remove('period-btn--active'));
      // Add active class to clicked button
      this.classList.add('period-btn--active');
      
      // Reset and trigger animations
      resetAnalyticsAnimations();
      setTimeout(() => {
        const period = this.dataset.period;
        updateAnalyticsData(period);
      }, 300);
    });
  });

  // History filter functionality
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      filterTabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Get filter type and apply
      const filterType = this.dataset.filter;
      filterTransactions(filterType);
    });
  });

  // Search functionality
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      searchTransactions(searchTerm);
    });
  }

  // Month filter functionality
  const monthFilter = document.querySelector('.month-filter');
  if (monthFilter) {
    monthFilter.addEventListener('change', function() {
      const selectedMonth = this.value;
      filterByMonth(selectedMonth);
    });
  }

  // Modal functionality for Lainnya button
  const moreButton = document.querySelector('[data-action="more"]');
  const moreModal = document.getElementById('moreModal');
  const closeModalBtn = document.getElementById('closeMoreModal');
  
  if (moreButton && moreModal) {
    moreButton.addEventListener('click', (e) => {
      e.preventDefault();
      moreModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    });
  }
  
  if (closeModalBtn && moreModal) {
    closeModalBtn.addEventListener('click', () => {
      moreModal.classList.remove('active');
      document.body.style.overflow = ''; // Restore scroll
    });
  }
  
  // Close modal when clicking overlay
  if (moreModal) {
    moreModal.addEventListener('click', (e) => {
      if (e.target === moreModal) {
        moreModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Handle feature button clicks in modal
  const featureButtons = document.querySelectorAll('.feature-btn');
  featureButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.dataset.action;
      
      // Close modal first
      if (moreModal) {
        moreModal.classList.remove('active');
        document.body.style.overflow = '';
      }
      
      // Show notification for feature
      showNotification(`Fitur ${btn.querySelector('span').textContent} akan segera hadir! 🚀`, 'info');
    });
  });

  // Month filter functionality (already handled above)
};

// Animation Functions
const animateBalance = (newBalance) => {
  const currentBalance = appState.balance;
  const difference = newBalance - currentBalance;
  const steps = 30;
  const stepValue = difference / steps;
  let currentStep = 0;
  
  const animate = () => {
    if (currentStep < steps) {
      appState.balance = currentBalance + (stepValue * currentStep);
      render();
      currentStep++;
      requestAnimationFrame(animate);
    } else {
      appState.balance = newBalance;
      render();
    }
  };
  
  animate();
};

// API Functions (Mock)
const mockAPI = {
  getBalance: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          balance: 2500000 + Math.floor(Math.random() * 100000),
          points: 1250 + Math.floor(Math.random() * 100),
          tier: 'BASIC'
        });
      }, 1000);
    });
  },
  
  updateBalance: async () => {
    try {
      const data = await mockAPI.getBalance();
      animateBalance(data.balance);
      appState.points = data.points;
      appState.tier = data.tier;
      render();
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  }
};

// Touch Gestures
let touchStartX = 0;
let touchStartY = 0;

const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
};

const handleTouchEnd = (e) => {
  if (!touchStartX || !touchStartY) return;
  
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  
  // Horizontal swipe detection
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    const pages = ['home', 'analytics', 'history', 'notifications', 'profile'];
    const currentIndex = pages.indexOf(appState.currentPage);
    
    if (deltaX > 0 && currentIndex > 0) {
      // Swipe right - previous page
      showPage(pages[currentIndex - 1]);
    } else if (deltaX < 0 && currentIndex < pages.length - 1) {
      // Swipe left - next page
      showPage(pages[currentIndex + 1]);
    }
  }
  
  touchStartX = 0;
  touchStartY = 0;
};

// Notification Functions
const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-card);
    color: var(--text-primary);
    padding: 12px 20px;
    border-radius: 8px;
    border: 1px solid var(--border-primary);
    z-index: 9999;
    animation: slideDown 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideUp 0.3s ease-out forwards';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
};

// History Filter Functions
const filterTransactions = (filterType) => {
  const transactionItems = document.querySelectorAll('.transaction-item');
  const transactionGroups = document.querySelectorAll('.transaction-group');
  
  transactionItems.forEach(item => {
    const itemType = item.getAttribute('data-type');
    
    if (filterType === 'all') {
      item.style.display = 'flex';
    } else if (filterType === 'income' && itemType === 'income') {
      item.style.display = 'flex';
    } else if (filterType === 'expense' && itemType === 'expense') {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
  
  // Hide/show groups based on visible items
  transactionGroups.forEach(group => {
    const visibleItems = group.querySelectorAll('.transaction-item[style*="flex"]');
    if (visibleItems.length === 0) {
      group.style.display = 'none';
    } else {
      group.style.display = 'block';
    }
  });
  
  // Update summary based on filter
  updateSummaryForFilter(filterType);
};

const searchTransactions = (searchTerm) => {
  const transactionItems = document.querySelectorAll('.transaction-item');
  const transactionGroups = document.querySelectorAll('.transaction-group');
  
  transactionItems.forEach(item => {
    const title = item.querySelector('.transaction-title').textContent.toLowerCase();
    const subtitle = item.querySelector('.transaction-subtitle').textContent.toLowerCase();
    
    if (title.includes(searchTerm) || subtitle.includes(searchTerm) || searchTerm === '') {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
  
  // Hide/show groups based on visible items
  transactionGroups.forEach(group => {
    const visibleItems = group.querySelectorAll('.transaction-item[style*="flex"]');
    if (visibleItems.length === 0) {
      group.style.display = 'none';
    } else {
      group.style.display = 'block';
    }
  });
};

const filterByMonth = (selectedMonth) => {
  // For now, show all transactions since we don't have date data
  // This can be enhanced when actual date filtering is needed
  const transactionGroups = document.querySelectorAll('.transaction-group');
  
  if (selectedMonth === 'all') {
    transactionGroups.forEach(group => {
      group.style.display = 'block';
    });
  } else {
    // This would filter by actual month data in a real implementation
    transactionGroups.forEach(group => {
      group.style.display = 'block';
    });
  }
};

const updateSummaryForFilter = (filterType) => {
  const summaryItems = document.querySelectorAll('.summary-item');
  
  if (filterType === 'income') {
    // Show only income summary
    summaryItems.forEach((item, index) => {
      if (index === 0) { // Total Masuk
        item.style.display = 'flex';
      } else {
        item.style.opacity = '0.5';
      }
    });
  } else if (filterType === 'expense') {
    // Show only expense summary
    summaryItems.forEach((item, index) => {
      if (index === 1) { // Total Keluar
        item.style.display = 'flex';
      } else {
        item.style.opacity = '0.5';
      }
    });
  } else {
    // Show all summaries
    summaryItems.forEach(item => {
      item.style.display = 'flex';
      item.style.opacity = '1';
    });
  }
};

// Initialize App
const initApp = () => {
  console.log('🚀 UKI-Wallet Mobile App Initialized');
  
  // Ensure home page is visible on first load
  showPage('home');
  
  // Render initial state
  render();
  
  // Initialize event listeners
  initEventListeners();
  
  // Add touch gestures
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  // Update balance periodically
  setInterval(() => {
    mockAPI.updateBalance();
  }, 30000); // Update every 30 seconds
  
  // Show welcome notification
  setTimeout(() => {
    showNotification('Selamat datang di UKI-Wallet Mobile! 👋', 'success');
  }, 1000);
};

// CSS Animations
const addAnimationStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from {
        transform: translateX(-50%) translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes slideUp {
      from {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
      to {
        transform: translateX(-50%) translateY(-100%);
        opacity: 0;
      }
    }
    
    .notification--success {
      border-color: var(--success) !important;
      background: var(--success-bg) !important;
    }
    
    .notification--error {
      border-color: var(--error) !important;
      background: var(--error-bg) !important;
    }
    
    .notification--warning {
      border-color: var(--warning) !important;
      background: var(--warning-bg) !important;
    }
  `;
  document.head.appendChild(style);
};

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  addAnimationStyles();
  initApp();
});

// Export functions for external use
window.UKIWallet = {
  showPage,
  updateBalance: mockAPI.updateBalance,
  showNotification,
  appState
};