// ============================================
// APP.JS - Inicialização do aplicativo
// ============================================

  document.addEventListener('DOMContentLoaded', function() {
  // Forçar tela de senha
  setTimeout(function() {
    Auth.showLockScreen();
  }, 300);
  
  var checkConfig = setInterval(function() {
    if (document.getElementById('authModal').style.display === 'none') {
      clearInterval(checkConfig);
      if (!Storage.isConfigured()) {
        openConfig();
      } else {
        updateSyncStatus('online');
      }
    }
  }, 500);
  
  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(function(reg) {
        console.log('Service Worker registrado');
      })
      .catch(function(err) {
        console.log('Erro no Service Worker:', err);
      });
  }
  
  // Tabs
  document.querySelectorAll('.tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      // Remover active de todas
      document.querySelectorAll('.tab').forEach(function(t) {
        t.classList.remove('active');
      });
      document.querySelectorAll('.tab-content').forEach(function(c) {
        c.classList.remove('active');
      });
      
      // Adicionar active na selecionada
      tab.classList.add('active');
      var tabId = 'tab-' + tab.dataset.tab;
      document.getElementById(tabId).classList.add('active');
      
      // Carregar histórico se for a tab de histórico
           if (tab.dataset.tab === 'history') {
        loadHistory();
      }
      if (tab.dataset.tab === 'dashboard') {
        Dashboard.load();
      }
    });
  });
});

function updateSyncStatus(status) {
  var dot = document.querySelector('.status-dot');
  var text = document.querySelector('.status-text');
  
  dot.className = 'status-dot ' + status;
  
  if (status === 'online') {
    text.textContent = 'Conectado';
  } else if (status === 'saving') {
    text.textContent = 'Salvando...';
  } else if (status === 'error') {
    text.textContent = 'Erro';
  }
}

// Zona de Perigo
async function clearRepertorio() {
  if (!confirm('ATENÇÃO: Isso apagará TODAS as músicas do repertório. Continuar?')) return;
  if (!confirm('Confirme novamente: TODAS as músicas serão apagadas permanentemente.')) return;
  
  try {
    await API.clearRepertorio();
    alert('Repertório apagado com sucesso.');
  } catch (error) {
    alert('Erro ao apagar: ' + error.message);
  }
}

async function clearShows() {
  if (!confirm('Apagar todo o histórico de shows?')) return;
  
  try {
    await API.clearShows();
    alert('Histórico apagado com sucesso.');
    loadHistory();
  } catch (error) {
    alert('Erro ao apagar: ' + error.message);
  }
}
// ============================================
// MELHORIAS UI - TOAST + LOADING
// ============================================

function showToast(message, type) {
  type = type || 'success';
  
  // Remove toast anterior
  var oldToast = document.querySelector('.toast');
  if (oldToast) oldToast.remove();
  
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(function() {
    toast.style.animation = 'slideDown 0.3s ease forwards';
    setTimeout(function() {
      toast.remove();
    }, 300);
  }, 3000);
}

function showLoading(button) {
  if (!button) return;
  button.disabled = true;
  button.dataset.originalText = button.textContent;
  button.innerHTML = '<span class="spinner"></span> Salvando...';
}

function hideLoading(button) {
  if (!button) return;
  button.disabled = false;
  button.textContent = button.dataset.originalText || 'Salvar Setlist';
}

// Substitui alert nativo por toast
var originalAlert = window.alert;
window.alert = function(message) {
  showToast(message, 'info');
};

// ============================================
// INSTALAÇÃO PWA
// ============================================

var deferredPrompt;

window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  deferredPrompt = e;
  
  // Mostrar botão de instalar
  var installBtn = document.getElementById('installBtn');
  if (installBtn) installBtn.style.display = 'flex';
});

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(result) {
      if (result.outcome === 'accepted') {
        showToast('App instalado!', 'success');
        document.getElementById('installBtn').style.display = 'none';
      }
      deferredPrompt = null;
    });
  } else {
    showToast('Opção não disponível. Use o menu do navegador.', 'info');
  }
}

// Esconder botão se já instalado
if (window.matchMedia('(display-mode: standalone)').matches) {
  var installBtn = document.getElementById('installBtn');
  if (installBtn) installBtn.style.display = 'none';
}