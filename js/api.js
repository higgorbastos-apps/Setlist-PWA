// ============================================
// API.JS - Comunicação com Google Apps Script
// ============================================

class API {
  static getConfig() {
    return Storage.getConfig();
  }

  static async call(action, data = {}) {
    const config = this.getConfig();
    if (!config.url || !config.token) {
      throw new Error('Configuração não encontrada. Configure o script e token.');
    }

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: action,
        token: config.token,
        ...data
      })
    });

    if (!response.ok) {
      throw new Error('HTTP error! status: ' + response.status);
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Resposta não é JSON:', text);
      throw new Error('Erro ao processar resposta do servidor');
    }
  }

  static async testConnection() {
    const config = this.getConfig();
    if (!config.url || !config.token) {
      throw new Error('URL e token são obrigatórios');
    }

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'carregar_dados',
        token: config.token
      })
    });

    if (!response.ok) throw new Error('Falha na conexão');
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  }

  static async saveSetlist(showData, local, musicas) {
    return this.call('salvar_setlist', { showData, local, musicas });
  }

  static async searchMusic(query) {
    return this.call('buscar', { query });
  }

  static async getShows() {
    return this.call('shows');
  }

  static async getSetlist(showId) {
    return this.call('setlist', { showId });
  }

  static async clearRepertorio() {
    return this.call('limpar_repertorio');
  }

  static async clearShows() {
    return this.call('limpar_historico');
  }
}