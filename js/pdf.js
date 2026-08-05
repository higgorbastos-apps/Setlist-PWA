// ============================================
// PDF.JS - Geração de PDF com jsPDF
// ============================================

function generatePDF(showData, musicas) {
  // Se não fornecidos, pega do preview atual
  if (!showData) {
    showData = document.getElementById('dataShow').value;
  }
  if (!musicas) {
    musicas = getMusicListFromPreview();
  }

  const local = document.getElementById('local').value || 'Setlist';
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('SETLIST', 105, 20, { align: 'center' });
  
  // Informações do show
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Local: ' + local, 20, 35);
  doc.text('Data: ' + showData, 20, 43);
  
  // Linha separadora dourada
  doc.setDrawColor(242, 183, 5);
  doc.setLineWidth(0.5);
  doc.line(20, 50, 190, 50);
  
  // Lista de músicas
  let y = 60;
  musicas.forEach(function(musica, index) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text((index + 1) + '.', 20, y);
    
    doc.setFont('helvetica', 'normal');
    doc.text(musica.nome, 35, y);
       
    y += 14;
  });
  
  var nomeLocal = local.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '').substring(0, 25);
var dataFormatada = showData.replace(/-/g, '');
doc.save('SETLIST-' + nomeLocal + '-' + dataFormatada + '.pdf');
}

function printSetlist() {
  window.print();
}

function generateLetrasPDF() {
  if (!currentMusicas || currentMusicas.length === 0) {
    alert('Nenhuma música no preview.');
    return;
  }
  
  // Filtrar apenas músicas com letra cadastrada
  var musicasComLetra = currentMusicas.filter(function(m) {
    return m.letra && m.letra.trim().length > 0;
  });
  
  if (musicasComLetra.length === 0) {
    alert('Nenhuma música com letra cadastrada.');
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  var primeira = true;
  
  musicasComLetra.forEach(function(musica) {
    if (!primeira) doc.addPage();
    primeira = false;
    
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
      doc.text('Harmonia:', 20, y);
      y += 7;
      doc.setFont('courier', 'normal');
      doc.setFontSize(12);
      var linhasHarmonia = musica.harmonia.split('\n');
      linhasHarmonia.forEach(function(linha) {
        if (y > 272) { doc.addPage(); y = 25; }
        doc.text(linha, 25, y);
        y += 6;
      });
      y += 4;
    }
    
    // Espaço após harmonia até a linha amarela
    y += 8;
    
    // Linha separadora
    doc.setDrawColor(242, 183, 5);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    
    // Espaço de 2 linhas após a linha amarela até a letra
    y += 14;
    
    // Letra
    doc.setFont('courier', 'normal');
    doc.setFontSize(14);
    var linhas = musica.letra.split('\n');
    linhas.forEach(function(linha) {
      if (y > 272) { doc.addPage(); y = 25; }
      doc.text(linha, 20, y);
      y += 7;
    });
  });
  
  doc.save('Letras_completo.pdf');
}
function generateSetlistPDF() {
  if (!currentMusicas || currentMusicas.length === 0) {
    alert('Nenhuma música no preview.');
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const local = document.getElementById('local').value || 'Setlist';
  const dataShow = document.getElementById('dataShow').value || '';
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('SETLIST', 105, 15, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(local + ' — ' + dataShow, 105, 22, { align: 'center' });
  
  doc.setDrawColor(242, 183, 5);
  doc.setLineWidth(0.5);
  doc.line(20, 26, 190, 26);
  
  var y = 34;
  
  currentMusicas.forEach(function(musica, index) {
    if (y > 272) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text((index + 1) + '. ' + musica.nome, 20, y);
    
    var meta = [];
    if (musica.tom) meta.push('Tom: ' + musica.tom);
    if (musica.bpm) meta.push('BPM: ' + musica.bpm);
    
    if (meta.length > 0) {
      y += 9;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(meta.join(' | '), 25, y);
    }
    
    y += 12;
  });
  
  var nomeLocal = local.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '').substring(0, 25);
var dataFormatada = showData.replace(/-/g, '');
doc.save('SETLIST-' + nomeLocal + '-' + dataFormatada + '.pdf');
}
