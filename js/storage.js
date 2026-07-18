// ============================================
// STORAGE.JS - Gerenciamento de localStorage
// ============================================

class Storage {
  static get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? JSON.parse(value) : defaultValue;
    } catch (e) {
      // Fallback para window (navegador privado)
      const wkey = '__b4_' + key;
      return window[wkey] !== undefined ? window[wkey] : defaultValue;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Fallback para window
      window['__b4_' + key] = value;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      delete window['__b4_' + key];
    }
  }

  static getConfig() {
    return {
      url: Storage.get('sheets_url', ''),
      token: Storage.get('sheets_token', '')
    };
  }

  static setConfig(url, token) {
    Storage.set('sheets_url', url);
    Storage.set('sheets_token', token);
  }

  static isConfigured() {
    const config = Storage.getConfig();
    return !!(config.url && config.token);
  }
}