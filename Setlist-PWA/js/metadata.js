var MetadataEditor = {
  keys: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
         'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm'],
  
  harmonyPresets: [
    { name: 'Básica (I IV V7 I)', value: 'I IV V7 I' },
    { name: 'Pop (I VIm IV V)', value: 'I VIm IV V' },
    { name: 'Jazz (IIm7 V7 Imaj7)', value: 'IIm7 V7 Imaj7' },
    { name: 'Blues (I7 IV7 V7)', value: 'I7 IV7 V7' },
    { name: 'Sertaneja (I V7 I)', value: 'I V7 I' },
    { name: 'Forró (I V7 I IV)', value: 'I V7 I IV' }
  ],

  show: function(index) {
    var musica = currentMusicas[index];
    if (!musica) return;
    
    var overlay = document.createElement('div');
    overlay.className = 'metadata-overlay';
    overlay.onclick = function(e) {
      if (e.target === overlay) overlay.remove();
    };
    
    var keysHtml = this.keys.map(function(k) {
      var active = musica.tom === k ? ' active' : '';
      return '<button class="key-chip' + active + '" onclick="MetadataEditor.setKey(' + index + ', \'' + k + '\')">' + k + '</button>';
    }).join('');
    
    var harmonyHtml = this.harmonyPresets.map(function(h) {
      var active = musica.harmonia === h.value ? ' selected' : '';
      return '<option value="' + h.value + '"' + active + '>' + h.name + '</option>';
    }).join('');
    
    overlay.innerHTML = 
      '<div class="metadata-panel">' +
        '<div class="metadata-header">' +
          '<h3>Editar: ' + escapeHtml(musica.nome) + '</h3>' +
          '<button class="icon-btn" onclick="this.closest(\'.metadata-overlay\').remove()">✕</button>' +
        '</div>' +
        '<div class="metadata-section">' +
          '<label>Tom</label>' +
          '<div class="key-grid">' + keysHtml + '</div>' +
        '</div>' +
        '<div class="metadata-section">' +
          '<label>Harmonia</label>' +
          '<select onchange="MetadataEditor.setHarmony(' + index + ', this.value)">' +
            '<option value="">Personalizada...</option>' +
            harmonyHtml +
          '</select>' +
          '<input type="text" value="' + escapeHtml(musica.harmonia || '') + '" ' +
            'placeholder="Ou digite a harmonia" ' +
            'onchange="MetadataEditor.setHarmony(' + index + ', this.value)">' +
        '</div>' +
        '<div class="metadata-section">' +
          '<label>BPM: <strong>' + (musica.bpm || '120') + '</strong></label>' +
          '<input type="range" min="60" max="200" value="' + (musica.bpm || 120) + '" ' +
            'oninput="MetadataEditor.setBPM(' + index + ', this.value); this.previousElementSibling.querySelector(\'strong\').textContent = this.value">' +
        '</div>' +
        '<div class="metadata-section">' +
          '<label>Letra da Música</label>' +
          '<textarea id="letraField" rows="6" style="width:100%;padding:8px;background:var(--bg-primary);border:1px solid var(--border);border-radius:var(--radius);color:var(--text-primary);font-family:Inter,sans-serif;font-size:0.85rem;resize:vertical;">' + escapeHtml(musica.letra || '') + '</textarea>' +
        '</div>' +
        '<div class="metadata-section">' +
          '<button class="btn btn-secondary" onclick="MetadataEditor.saveLetra(' + index + ')" style="width:100%;">💾 Salvar Letra na Planilha</button>' +
        '</div>' +
        '<div class="metadata-actions">' +
          '<button class="btn btn-secondary" onclick="MetadataEditor.applyToAll(' + index + ')">Aplicar a TODAS</button>' +
          '<button class="btn btn-primary" onclick="this.closest(\'.metadata-overlay\').remove(); renderPreview();">OK</button>' +
        '</div>' +
      '</div>';
    
    document.body.appendChild(overlay);
  },

  saveLetra: async function(index) {
    var musica = currentMusicas[index];
    var letra = document.getElementById('letraField').value;
    musica.letra = letra;
    
    try {
      var config = Storage.getConfig();
      var response = await fetch(config.url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'salvar_letra',
          token: config.token,
          musica: musica.nome,
          tom: musica.tom || '',
          letra: letra
        })
      });
      var result = await response.json();
      if (result.success) {
        showToast('Letra salva!', 'success');
      }
    } catch (error) {
      showToast('Erro ao salvar letra', 'error');
    }
  },

  setKey: function(index, key) {
    updateMusicMeta(index, 'tom', key);
    var chips = document.querySelectorAll('.key-chip');
    chips.forEach(function(c) { c.classList.remove('active'); });
    event.target.classList.add('active');
  },

  setHarmony: function(index, value) {
    updateMusicMeta(index, 'harmonia', value);
  },

  setBPM: function(index, value) {
    updateMusicMeta(index, 'bpm', value);
  },

  applyToAll: function(index) {
    if (!confirm('Aplicar Tom, Harmonia e BPM desta música para TODAS?')) return;
    var source = currentMusicas[index];
    currentMusicas.forEach(function(m, i) {
      if (i !== index) {
        m.tom = source.tom;
        m.harmonia = source.harmonia;
        m.bpm = source.bpm;
      }
    });
    renderPreview();
    showToast('Metadados aplicados!', 'success');
  }
};