// ============================================
// DASHBOARD.JS - Estatísticas rápidas
// ============================================

var Dashboard = {
  load: async function() {
    var container = document.getElementById('dashboardContent');
    container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-muted);">Carregando estatísticas...</p>';
    
    try {
      var data = await API.call('carregar_dados');
      this.render(data, container);
    } catch (error) {
      container.innerHTML = '<p style="color:var(--danger);text-align:center;padding:40px;">Erro ao carregar: ' + error.message + '</p>';
    }
  },

  render: function(data, container) {
    var resumo = data.resumo || {};
    var shows = data.shows || [];
    
    var totalShows = resumo.totalShows || 0;
    var totalMusicas = resumo.totalMusicas || 0;
    var mediaMensal = resumo.mediaMensal || 0;
    var top5 = resumo.topMusicas || [];
    var esquecidas = resumo.esquecidas || [];
    
    var html = '';
    
    // Cards de resumo
    html += '<div class="dash-cards">';
    html += this.card('Shows', totalShows, '#F2B705');
    html += this.card('Músicas', totalMusicas, '#4CAF50');
    html += this.card('Média/mês', mediaMensal, '#2196F3');
    html += this.card('Esquecidas', esquecidas.length, '#E05260');
    html += '</div>';
    
    // Top 5 músicas
    html += '<div class="dash-section">';
    html += '<h3>Top 5 Músicas</h3>';
    if (top5.length > 0) {
      html += '<div class="dash-list">';
      top5.forEach(function(m, i) {
        html += '<div class="dash-item">';
        html += '<span class="dash-pos">' + (i + 1) + '</span>';
        html += '<span class="dash-name">' + m.musica + '</span>';
        html += '<span class="dash-count">' + m.vezes + 'x</span>';
        html += '</div>';
      });
      html += '</div>';
    } else {
      html += '<p style="color:var(--text-muted);">Nenhuma música registrada ainda.</p>';
    }
    html += '</div>';
    
    // Músicas esquecidas
    html += '<div class="dash-section">';
    html += '<h3>Músicas Esquecidas (60+ dias)</h3>';
    if (esquecidas.length > 0) {
      html += '<p style="color:var(--text-muted);font-size:0.85rem;">' + esquecidas.slice(0, 10).join(', ') + '</p>';
    } else {
      html += '<p style="color:var(--text-muted);">Nenhuma música esquecida.</p>';
    }
    html += '</div>';
    
    // Últimos shows
    html += '<div class="dash-section">';
    html += '<h3>Últimos Shows</h3>';
    if (shows.length > 0) {
      html += '<div class="dash-list">';
      shows.slice(0, 5).forEach(function(s) {
        html += '<div class="dash-item">';
        html += '<span class="dash-name">' + s.local + '</span>';
        html += '<span class="dash-count">' + s.qtdMusicas + ' músicas</span>';
        html += '<span style="color:var(--text-muted);font-size:0.8rem;">' + s.dataShow + '</span>';
        html += '</div>';
      });
      html += '</div>';
    } else {
      html += '<p style="color:var(--text-muted);">Nenhum show registrado.</p>';
    }
    html += '</div>';
    
    container.innerHTML = html;
  },

  card: function(label, value, color) {
    return '<div class="dash-card" style="border-top: 3px solid ' + color + ';">' +
      '<span class="dash-card-value">' + value + '</span>' +
      '<span class="dash-card-label">' + label + '</span>' +
    '</div>';
  }
};