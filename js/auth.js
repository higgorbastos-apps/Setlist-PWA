var Auth = {
  LOCK_KEY: 'setlist_lock',
  ATTEMPTS_KEY: 'setlist_attempts',
  LOCKOUT_KEY: 'setlist_lockout',
  MAX_ATTEMPTS: 5,
  LOCKOUT_MINUTES: 5,

  needsPassword: function() {
    return Storage.get(this.LOCK_KEY) !== null;
  },

  isLockedOut: function() {
    var lockTime = Storage.get(this.LOCKOUT_KEY, 0);
    if (Date.now() < lockTime) {
      var minutes = Math.ceil((lockTime - Date.now()) / 60000);
      alert('Bloqueado. Tente em ' + minutes + ' minuto(s).');
      return true;
    }
    return false;
  },

  hashPassword: function(pass) {
    var hash = 0;
    for (var i = 0; i < pass.length; i++) {
      hash = ((hash << 5) - hash) + pass.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  },

  setup: function(password, confirmPassword) {
    if (password.length < 4) {
      alert('A senha deve ter pelo menos 4 caracteres.');
      return false;
    }
    if (password !== confirmPassword) {
      alert('As senhas não conferem!');
      return false;
    }
    Storage.set(this.LOCK_KEY, this.hashPassword(password));
    Storage.set(this.ATTEMPTS_KEY, 0);
    alert('Senha criada com sucesso!');
    return true;
  },

  verify: function(password) {
    var stored = Storage.get(this.LOCK_KEY);
    if (!stored) return true;
    
    var attempts = Storage.get(this.ATTEMPTS_KEY, 0);
    if (attempts >= this.MAX_ATTEMPTS) {
      Storage.set(this.LOCKOUT_KEY, Date.now() + this.LOCKOUT_MINUTES * 60000);
      alert('Muitas tentativas! Bloqueado por ' + this.LOCKOUT_MINUTES + ' minutos.');
      return false;
    }

    if (this.hashPassword(password) !== stored) {
      Storage.set(this.ATTEMPTS_KEY, attempts + 1);
      var remaining = this.MAX_ATTEMPTS - (attempts + 1);
      alert('Senha incorreta! ' + remaining + ' tentativa(s) restante(s).');
      return false;
    }
    
    Storage.set(this.ATTEMPTS_KEY, 0);
    return true;
  },

  showLockScreen: function() {
    if (this.isLockedOut()) return;
    
    var modal = document.getElementById('authModal');
    if (!modal) return;
    
    if (this.needsPassword()) {
      document.getElementById('authTitle').textContent = 'Acesso Restrito';
      document.getElementById('authSubtitle').textContent = 'Digite a senha para acessar';
      document.getElementById('setupFields').style.display = 'none';
      document.getElementById('loginFields').style.display = 'block';
      document.getElementById('authBtn').textContent = 'Entrar';
    } else {
      document.getElementById('authTitle').textContent = 'Primeiro Acesso';
      document.getElementById('authSubtitle').textContent = 'Crie uma senha para proteger seus dados';
      document.getElementById('setupFields').style.display = 'block';
      document.getElementById('loginFields').style.display = 'none';
      document.getElementById('authBtn').textContent = 'Criar Senha';
    }
    
    modal.style.display = 'flex';
  },

  handleAuth: function() {
    if (this.needsPassword()) {
      // Modo login
      var loginInput = document.getElementById('authLoginPassword');
      if (!loginInput) { alert('Erro: campo de login não encontrado!'); return; }
      var password = loginInput.value;
      if (!password) { alert('Digite a senha!'); return; }
      if (this.verify(password)) {
        document.getElementById('authModal').style.display = 'none';
      }
    } else {
      // Modo setup
      var setupInput = document.getElementById('authSetupPassword');
      var confirmInput = document.getElementById('authConfirm');
      if (!setupInput) { alert('Erro: campo de senha não encontrado!'); return; }
      var password = setupInput.value;
      var confirm = confirmInput ? confirmInput.value : '';
      if (!password) { alert('Digite uma senha!'); return; }
      if (this.setup(password, confirm)) {
        document.getElementById('authModal').style.display = 'none';
      }
    }
  },
  resetPassword: function() {
    if (confirm('Remover a senha de acesso?')) {
      Storage.remove(this.LOCK_KEY);
      Storage.remove(this.ATTEMPTS_KEY);
      Storage.remove(this.LOCKOUT_KEY);
      alert('Senha removida.');
      location.reload();
    }
  }
};