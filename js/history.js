// ============================================
// HISTORY.JS - Histórico de shows
// ============================================

async function loadHistory() {
  try {
    var shows = await API.getShows();
    renderHistory(shows);
  } catch (error) {
    document.getElementById('historyList').innerHTML = 
      '<p style="color: #DC3545;">Erro ao carregar histórico: ' + error.message + '</p>';
  }
}

function renderHistory(shows) {
  var container = document.getElementById('historyList');
  
  if (!shows || shows.length === 0) {
    container.innerHTML = '<p style="color: #6B6960;">Nenhum show registrado.</p>';
    return;
  }
  
  container.innerHTML = shows.map(function(show, index) {
    return '<div class="show-card" id="show-' + index + '">' +
      '<h4>' + escapeHtml(show.local) + '</h4>' +
      '<div class="show-details">' +
        show.dataShow + ' | ' + show.qtdMusicas + ' músicas' +
      '</div>' +
      '<div class="show-setlist" id="show-setlist-' + index + '" style="display: none;"></div>' +
      '<div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">' +
        '<button class="btn btn-secondary" onclick="toggleShowSetlist(' + index + ', \'' + show.dataShow + '\')">' +
          'Ver Setlist' +
        '</button>' +
        '<button class="btn btn-secondary" onclick="reuseSetlist(\'' + show.dataShow + '\', \'' + escapeHtml(show.local) + '\')">' +
          'Reutilizar' +
        '</button>' +
        '<button class="btn btn-secondary" onclick="generateShowPDF(\'' + show.dataShow + '\')">' +
          'PDF' +
        '</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

async function toggleShowSetlist(index, showId) {
  var container = document.getElementById('show-setlist-' + index);
  
  if (container.style.display === 'none' || container.style.display === '') {
    try {
      var musicas = await API.getSetlist(showId);
      if (!musicas || musicas.length === 0) {
        container.innerHTML = '<p style="color: #6B6960;">Nenhuma música encontrada para esta data.</p>';
        container.style.display = 'block';
        return;
      }
      container.innerHTML = musicas.map(function(m, i) {
        return '<div style="padding: 4px 0; font-size: 0.9rem;">' +
          (i + 1) + '. ' + escapeHtml(m.musica) +
          (m.tom ? ' [' + m.tom + ']' : '') +
        '</div>';
      }).join('');
      container.style.display = 'block';
    } catch (error) {
      container.innerHTML = '<p style="color: #DC3545;">Erro: ' + error.message + '</p>';
      container.style.display = 'block';
    }
  } else {
    container.style.display = 'none';
  }
}

async function reuseSetlist(showData, local) {
  try {
    var musicas = await API.getSetlist(showData);
    if (!musicas || musicas.length === 0) {
      alert('Nenhuma música encontrada para este show.');
      return;
    }
    
    document.getElementById('dataShow').value = showData;
    document.getElementById('local').value = local;
    
    currentMusicas = musicas.map(function(m) {
      return {
        nome: m.musica,
        tom: m.tom || '',
        harmonia: m.harmonia || '',
        bpm: m.bpm || '',
        letra: m.letra || ''
      };
    });
    
    var registerTab = document.querySelector('[data-tab="register"]');
    if (registerTab) registerTab.click();
    
    renderPreview();
  } catch (error) {
    alert('Erro ao carregar setlist: ' + error.message);
  }
}

async function generateShowPDF(showId) {
  try {
    var musicas = await API.getSetlist(showId);
    if (!musicas || musicas.length === 0) {
      alert('Nenhuma música encontrada para gerar PDF.');
      return;
    }
    
    var musicasFormatadas = musicas.map(function(m) {
      return {
        nome: m.musica,
        tom: m.tom || '',
        harmonia: m.harmonia || '',
        bpm: m.bpm || '',
        letra: m.letra || ''
      };
    });
    
    generatePDF(showId, musicasFormatadas);
  } catch (error) {
    alert('Erro ao gerar PDF: ' + error.message);
  }
}
