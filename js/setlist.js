var currentMusicas = [];

function parseSetlist() {
  var input = document.getElementById('listaMusicas').value;
  var linhas = input.split('\n').filter(function(l) { return l.trim() !== ''; });
  var musicas = linhas.map(function(linha) {
    var nome = linha.replace(/^[\d]+[.)]\s*/, '').replace(/^[-•]\s*/, '').trim();
    return { nome: nome, tom: '', harmonia: '', bpm: '' };
  }).filter(function(m) { return m.nome !== ''; });
  if (musicas.length === 0) { alert('Nenhuma música encontrada.'); return; }
  currentMusicas = musicas;
  renderPreview();
}

function renderPreview() {
  var preview = document.getElementById('preview');
  var musicList = document.getElementById('musicList');
  preview.style.display = 'block';
  var local = document.getElementById('local').value;
  var data = document.getElementById('dataShow').value;
  document.getElementById('previewMeta').textContent = local + ' - ' + data + ' (' + currentMusicas.length + ' músicas)';
  musicList.innerHTML = '';
  currentMusicas.forEach(function(musica, index) {
    var div = document.createElement('div');
    div.className = 'music-item';
    div.id = 'music-' + index;
    var h = '';
    h += '<span class="music-number">' + (index + 1) + '</span>';
    h += '<button class="icon-btn" onclick="MetadataEditor.show(' + index + ')" style="margin-left:4px;cursor:pointer;font-size:0.8rem;">EDITAR</button>';
    h += '<div class="music-content">';
    h += '<div class="music-name" style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">';
h += '<input type="text" value="' + escapeHtml(musica.nome) + '" onchange="updateMusicName(' + index + ', this.value)" style="flex:1;min-width:120px;">';
if (musica.tom) h += '<span style="font-size:0.7rem;color:var(--accent);background:var(--bg-primary);padding:2px 6px;border-radius:10px;">' + musica.tom + '</span>';
if (musica.harmonia) h += '<span style="font-size:0.7rem;color:var(--text-muted);background:var(--bg-primary);padding:2px 6px;border-radius:10px;">' + musica.harmonia + '</span>';
if (musica.letra) h += '<button class="icon-btn" onclick="toggleLetra(' + index + ')" title="Ver Letra" style="font-size:0.8rem;">📄</button>';
h += '</div>';
if (musica.letra) {
  h += '<div class="music-letra" id="letra-' + index + '" style="display:none;font-size:0.75rem;color:var(--text-muted);margin-top:4px;padding:6px;background:var(--bg-primary);border-radius:4px;white-space:pre-wrap;">' + escapeHtml(musica.letra) + '</div>';
  h += '<button class="btn btn-secondary" id="btn-pdf-' + index + '" onclick="gerarPDFIndividual(' + index + ')" style="display:none;margin-top:4px;font-size:0.7rem;padding:4px 10px;">📥 PDF desta música</button>';
}
    h += '<div class="music-metadata" id="metadata-' + index + '">';
    h += '<label>Tom<input type="text" value="' + escapeHtml(musica.tom) + '" onchange="updateMusicMeta(' + index + ', \'tom\', this.value)"></label>';
    h += '<label>Harmonia<input type="text" value="' + escapeHtml(musica.harmonia) + '" onchange="updateMusicMeta(' + index + ', \'harmonia\', this.value)"></label>';
    h += '<label>BPM<input type="text" value="' + escapeHtml(musica.bpm) + '" onchange="updateMusicMeta(' + index + ', \'bpm\', this.value)"></label>';
    h += '</div></div>';
    h += '<div class="music-actions">';
    h += '<button class="icon-btn" onclick="toggleMetadata(' + index + ')">+</button>';
    h += '<button class="icon-btn" onclick="removeMusic(' + index + ')">x</button>';
    h += '</div>';
    div.innerHTML = h;
    musicList.appendChild(div);
  });
  preview.scrollIntoView({ behavior: 'smooth' });
}

function getMusicListFromPreview() { return currentMusicas; }
function updateMusicName(index, value) { if (currentMusicas[index]) currentMusicas[index].nome = value; }
function updateMusicMeta(index, field, value) { if (currentMusicas[index]) currentMusicas[index][field] = value; }
function toggleMetadata(index) { var item = document.getElementById('music-' + index); if (item) item.classList.toggle('expanded'); }
function removeMusic(index) { if (confirm('Remover esta música?')) { currentMusicas.splice(index, 1); renderPreview(); } }

async function saveSetlist() {
  var local = document.getElementById('local').value;
  var dataShow = document.getElementById('dataShow').value;
  if (!local || !dataShow || currentMusicas.length === 0) { showToast('Preencha todos os campos.', 'error'); return; }
  var saveBtn = document.querySelector('.preview-actions .btn-primary');
  showLoading(saveBtn);
  updateSyncStatus('saving');
  try {
    var result = await API.saveSetlist(dataShow, local, currentMusicas);
    hideLoading(saveBtn);
    showToast('Setlist salva! ' + result.qtdMusicas + ' músicas.', 'success');
    updateSyncStatus('online');
  } catch (error) {
    hideLoading(saveBtn);
    showToast('Erro: ' + error.message, 'error');
    updateSyncStatus('error');
  }
}

function clearForm() {
  if (confirm('Limpar formulário?')) {
    document.getElementById('setlistForm').reset();
    document.getElementById('preview').style.display = 'none';
    currentMusicas = [];
  }
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
function toggleLetra(index) {
  var el = document.getElementById('letra-' + index);
  var btn = document.getElementById('btn-pdf-' + index);
  if (el) {
    var isHidden = el.style.display === 'none';
    el.style.display = isHidden ? 'block' : 'none';
    if (btn) btn.style.display = isHidden ? 'inline-block' : 'none';
  }
}

function gerarPDFIndividual(index) {
  var musica = currentMusicas[index];
  if (!musica) return;
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  var y = 25;
  
  // Título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(musica.nome, 20, y);
  y += 14;
  
  // Tom
  if (musica.tom) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Tom: ' + musica.tom, 20, y);
    y += 10;
  }
  
  // BPM
  if (musica.bpm) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('BPM: ' + musica.bpm, 20, y);
    y += 10;
  }
  
  // Harmonia
  if (musica.harmonia) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Harmonia: ' + musica.harmonia, 20, y);
    y += 10;
  }
  
  // Linha separadora
  y += 4;
  doc.setDrawColor(242, 183, 5);
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += 10;
  
  // Letra
  if (musica.letra && musica.letra.trim()) {
    doc.setFont('courier', 'normal');
    doc.setFontSize(14);
    var linhas = musica.letra.split('\n');
    linhas.forEach(function(linha) {
      if (y > 272) {
        doc.addPage();
        y = 25;
      }
      doc.text(linha, 20, y);
      y += 7;
    });
  }
  
  var nomeArquivo = musica.nome.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  doc.save(nomeArquivo + '.pdf');
}
