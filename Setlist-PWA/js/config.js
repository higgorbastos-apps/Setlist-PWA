// ============================================
// CONFIG.JS - Modal de configuração
// ============================================

function openConfig() {
  var modal = document.getElementById('configModal');
  var config = Storage.getConfig();
  document.getElementById('scriptUrl').value = config.url;
  document.getElementById('secretToken').value = config.token;
  modal.style.display = 'flex';
}

function closeConfig() {
  document.getElementById('configModal').style.display = 'none';
}

async function testConnection() {
  var url = document.getElementById('scriptUrl').value;
  var token = document.getElementById('secretToken').value;
  
  if (!url || !token) {
    showConfigMessage('Preencha URL e token.', 'error');
    return;
  }
  
  // Salvar temporariamente para testar
  Storage.setConfig(url, token);
  
  showConfigMessage('Testando conexão...', 'success');
  
  try {
    await API.testConnection();
    showConfigMessage('Conexão bem-sucedida! Script funcionando.', 'success');
  } catch (error) {
    showConfigMessage('Falha na conexão: ' + error.message, 'error');
  }
}

function saveConfig() {
  var url = document.getElementById('scriptUrl').value;
  var token = document.getElementById('secretToken').value;
  
  if (!url || !token) {
    showConfigMessage('Preencha URL e token.', 'error');
    return;
  }
  
  Storage.setConfig(url, token);
  showConfigMessage('Configuração salva!', 'success');
  
  setTimeout(function() {
    closeConfig();
    updateSyncStatus('online');
  }, 1000);
}

function showConfigMessage(text, type) {
  var msg = document.getElementById('configMessage');
  msg.textContent = text;
  msg.className = 'message ' + type;
}

// Close modal on outside click
document.addEventListener('click', function(e) {
  if (e.target.id === 'configModal') {
    closeConfig();
  }
});