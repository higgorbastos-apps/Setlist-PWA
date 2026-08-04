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
    
    // Metadados se existirem
    if (musica.tom || musica.harmonia || musica.bpm) {
      y += 9;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      var meta = [];
      if (musica.tom) meta.push('Tom: ' + musica.tom);
      if (musica.harmonia) meta.push('Harmonia: ' + musica.harmonia);
      if (musica.bpm) meta.push('BPM: ' + musica.bpm);
      doc.text(meta.join(' | '), 35, y);
    }
    
    y += 14;
  });
  
  doc.save('setlist-' + showData + '.pdf');
}

function printSetlist() {
  window.print();
}

function generateLetrasPDF() {
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
  doc.text('LETRAS - ' + local, 105, 15, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(dataShow, 105, 22, { align: 'center' });
  
  doc.setDrawColor(242, 183, 5);
  doc.setLineWidth(0.5);
  doc.line(20, 26, 190, 26);
  
  var y = 34;
  
  currentMusicas.forEach(function(musica, index) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    var titulo = (index + 1) + '. ' + musica.nome;
    if (musica.tom) titulo += ' — Tom: ' + musica.tom;
    if (musica.bpm) titulo += ' | BPM: ' + musica.bpm;
    doc.text(titulo, 25, y);
    y += 12;
    
    if (musica.letra && musica.letra.trim()) {
      doc.setFont('courier', 'normal');
      doc.setFontSize(14);
      var linhas = musica.letra.split('\n');
      linhas.forEach(function(linha) {
        if (y > 272) {
          doc.addPage();
          y = 20;
        }
        doc.text(linha, 30, y);
        y += 7;
      });
    } else {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(12);
      doc.text('(sem letra cadastrada)', 30, y);
      y += 5;
    }
    
    y += 12;
  });
  
  doc.save('letras-' + dataShow + '.pdf');
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
  
  doc.save('setlist-' + dataShow + '.pdf');
}
