// ============================================
// SEARCH.JS - Busca de músicas
// ============================================

var searchTimeout;

function searchMusic() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async function() {
    var query = document.getElementById('searchInput').value.trim();
    
    if (query.length < 2) {
      document.getElementById('searchResults').innerHTML = '';
      return;
    }
    
    try {
      var results = await API.searchMusic(query);
      renderSearchResults(results);
    } catch (error) {
      document.getElementById('searchResults').innerHTML = 
        '<p style="color: #DC3545;">Erro ao buscar: ' + error.message + '</p>';
    }
  }, 300);
}

function renderSearchResults(results) {
  var container = document.getElementById('searchResults');
  
  if (!results || results.length === 0) {
    container.innerHTML = '<p style="color: #6B6960;">Nenhuma música encontrada.</p>';
    return;
  }
  
  container.innerHTML = results.map(function(r) {
    return '<div class="result-card">' +
      '<div class="music-name">' + escapeHtml(r.musica) + '</div>' +
      '<div class="show-info">' +
        r.dataShow + ' - ' + r.local + ' | Ordem: #' + r.ordem +
        (r.tom ? ' | Tom: ' + r.tom : '') +
        (r.harmonia ? ' | Harmonia: ' + r.harmonia : '') +
        (r.bpm ? ' | BPM: ' + r.bpm : '') +
      '</div>' +
    '</div>';
  }).join('');
}