// GOOGLE APPS SCRIPT MELHORADO PARA DIAGNÓSTICO 360°
// Cole este código no Google Apps Script (script.google.com)

function doPost(e) {
  try {
    // ID da sua planilha do Google Sheets
    const SHEET_ID = 'SEU_ID_DA_PLANILHA_AQUI'; // Substitua pelo ID da sua planilha
    
    // Abrir a planilha
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Verificar se é a primeira vez (criar cabeçalhos)
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Data/Hora',
        'Nome',
        'Email', 
        'Clínica',
        'Ramo',
        'Telefone',
        'Cidade',
        'Faturamento Mensal',
        'Número Funcionários',
        'Tempo Mercado',
        'Pontuação Total',
        'Percentual',
        'Gestão Financeira (Score)',
        'Marketing (Score)',
        'Experiência Paciente (Score)',
        'Gestão Equipe (Score)',
        'Estratégia Negócio (Score)',
        'Classificação Geral',
        'Prioridade',
        // Respostas detalhadas por seção
        'Fin 1 - Controle mensal faturamento',
        'Fin 2 - Ticket médio',
        'Fin 3 - Indicadores financeiros',
        'Fin 4 - Serviços rentáveis',
        'Fin 5 - Estratégias precificação',
        'Mkt 1 - Identidade visual',
        'Mkt 2 - Captação consistente',
        'Mkt 3 - Estratégia digital',
        'Mkt 4 - Taxa conversão',
        'Mkt 5 - Fidelização',
        'Exp 1 - Equipe treinada',
        'Exp 2 - Processos padronizados',
        'Exp 3 - Alta satisfação',
        'Exp 4 - Redução faltas',
        'Exp 5 - Diferencial competitivo',
        'Eq 1 - Indicadores performance',
        'Eq 2 - Reuniões periódicas',
        'Eq 3 - Protocolos claros',
        'Eq 4 - Equipe motivada',
        'Eq 5 - Independência operacional',
        'Est 1 - Metas claras',
        'Est 2 - Escalabilidade',
        'Est 3 - Posicionamento mercado',
        'Est 4 - Planos expansão',
        'Est 5 - Próximos passos'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Formatar cabeçalhos
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground('#1e40af')
        .setFontColor('white')
        .setFontWeight('bold')
        .setFontSize(10);
        
      // Congelar primeira linha
      sheet.setFrozenRows(1);
      
      // Ajustar largura das colunas principais
      sheet.setColumnWidth(1, 150); // Data/Hora
      sheet.setColumnWidth(2, 200); // Nome
      sheet.setColumnWidth(3, 250); // Email
      sheet.setColumnWidth(4, 250); // Clínica
    }
    
    // Processar dados recebidos
    const data = JSON.parse(e.postData.contents);
    
    // Calcular pontuações por seção
    const sectionScores = [];
    for (let secao = 0; secao < 5; secao++) {
      let score = 0;
      for (let item = 0; item < 5; item++) {
        const key = `${secao}-${item}`;
        if (data.respostas[key]) score++;
      }
      sectionScores.push(score);
    }
    
    // Determinar classificação e prioridade
    let classificacao = '';
    let prioridade = '';
    
    if (data.pontuacao <= 8) {
      classificacao = 'Crítico - Necessita Intervenção Imediata';
      prioridade = 'ALTA';
    } else if (data.pontuacao <= 15) {
      classificacao = 'Estágio Inicial - Grandes Oportunidades';
      prioridade = 'ALTA';
    } else if (data.pontuacao <= 20) {
      classificacao = 'Desenvolvimento - Boa Base para Crescer';
      prioridade = 'MÉDIA';
    } else {
      classificacao = 'Avançado - Pronto para Escalar';
      prioridade = 'BAIXA';
    }
    
    // Converter respostas do objeto para array
    const respostas = [];
    for (let secao = 0; secao < 5; secao++) {
      for (let item = 0; item < 5; item++) {
        const key = `${secao}-${item}`;
        respostas.push(data.respostas[key] ? 'SIM' : 'NÃO');
      }
    }
    
    // Preparar linha de dados
    const rowData = [
      new Date(data.timestamp),
      data.nome,
      data.email,
      data.clinica,
      data.ramo,
      data.telefone || '',
      data.cidade || '',
      data.faturamentoMensal || '',
      data.numeroFuncionarios || '',
      data.tempoMercado || '',
      data.pontuacao,
      data.percentual + '%',
      sectionScores[0], // Gestão Financeira
      sectionScores[1], // Marketing
      sectionScores[2], // Experiência Paciente
      sectionScores[3], // Gestão Equipe
      sectionScores[4], // Estratégia Negócio
      classificacao,
      prioridade,
      ...respostas
    ];
    
    // Adicionar dados na próxima linha
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    
    // Formatar linha baseada na prioridade
    let cor = '#ffffff';
    if (prioridade === 'ALTA') cor = '#fef2f2'; // Vermelho claro
    else if (prioridade === 'MÉDIA') cor = '#fffbeb'; // Amarelo claro
    else if (prioridade === 'BAIXA') cor = '#f0fdf4'; // Verde claro
    
    sheet.getRange(nextRow, 1, 1, rowData.length).setBackground(cor);
    
    // Destacar pontuação total com cores
    const pontuacaoCol = 11; // Coluna K (Pontuação Total)
    let corPontuacao = '#dc2626'; // Vermelho
    if (data.pontuacao > 15) corPontuacao = '#f59e0b'; // Amarelo
    if (data.pontuacao > 20) corPontuacao = '#16a34a'; // Verde
    
    sheet.getRange(nextRow, pontuacaoCol).setFontColor(corPontuacao).setFontWeight('bold');
    
    // Destacar scores por seção (colunas M a Q)
    for (let i = 0; i < 5; i++) {
      const colIndex = 13 + i; // Colunas M, N, O, P, Q
      const score = sectionScores[i];
      let corScore = '#dc2626'; // Vermelho para 0-2
      if (score >= 3) corScore = '#f59e0b'; // Amarelo para 3
      if (score >= 4) corScore = '#16a34a'; // Verde para 4-5
      
      sheet.getRange(nextRow, colIndex).setFontColor(corScore).setFontWeight('bold');
    }
    
    // Adicionar fórmulas de análise (se não existirem)
    if (nextRow === 2) { // Primeira linha de dados
      // Adicionar estatísticas na parte inferior
      const statsRow = nextRow + 2;
      sheet.getRange(statsRow, 1).setValue('ESTATÍSTICAS:').setFontWeight('bold');
      sheet.getRange(statsRow + 1, 1).setValue('Total Diagnósticos:');
      sheet.getRange(statsRow + 1, 2).setFormula('=COUNTA(A2:A1000)');
      sheet.getRange(statsRow + 2, 1).setValue('Média Pontuação:');
      sheet.getRange(statsRow + 2, 2).setFormula('=AVERAGE(K2:K1000)');
      sheet.getRange(statsRow + 3, 1).setValue('Prioridade Alta:');
      sheet.getRange(statsRow + 3, 2).setFormula('=COUNTIF(S2:S1000,"ALTA")');
    }
    
    // Retornar sucesso
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true, 
        row: nextRow,
        pontuacao: data.pontuacao,
        classificacao: classificacao,
        prioridade: prioridade
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log do erro para debug
    console.error('Erro no script:', error);
    
    // Retornar erro
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false, 
        error: error.toString(),
        line: error.lineNumber || 'desconhecida'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função para testar o script
function testeCompleto() {
  const dadosTeste = {
    timestamp: new Date().toISOString(),
    nome: 'Dr. João Silva',
    email: 'joao@clinicateste.com',
    clinica: 'Clínica Cardiológica Teste',
    ramo: 'Cardiologia',
    telefone: '(11) 99999-9999',
    cidade: 'São Paulo/SP',
    faturamentoMensal: 'R$ 80.000',
    numeroFuncionarios: '8 funcionários',
    tempoMercado: '5 anos',
    pontuacao: 18,
    percentual: 72,
    respostas: {
      '0-0': true, '0-1': true, '0-2': false, '0-3': true, '0-4': false,
      '1-0': true, '1-1': false, '1-2': true, '1-3': true, '1-4': false,
      '2-0': true, '2-1': true, '2-2': true, '2-3': false, '2-4': true,
      '3-0': false, '3-1': true, '3-2': true, '3-3': false, '3-4': false,
      '4-0': true, '4-1': false, '4-2': true, '4-3': true, '4-4': false
    }
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(dadosTeste)
    }
  };
  
  const resultado = doPost(e);
  console.log('Resultado do teste:', resultado.getContent());
}

// Função para criar gráficos automáticos (opcional)
function criarGraficos() {
  const SHEET_ID = 'SEU_ID_DA_PLANILHA_AQUI';
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  
  // Criar gráfico de distribuição de pontuações
  const chartBuilder = sheet.newChart()
    .setChartType(Charts.ChartType.HISTOGRAM)
    .addRange(sheet.getRange('K2:K1000'))
    .setPosition(2, 25, 0, 0)
    .setOption('title', 'Distribuição de Pontuações')
    .setOption('width', 400)
    .setOption('height', 300);
    
  sheet.insertChart(chartBuilder.build());
}

