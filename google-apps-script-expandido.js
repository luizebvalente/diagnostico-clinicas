// GOOGLE APPS SCRIPT EXPANDIDO PARA DIAGNÓSTICO 360° COMPLETO
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
        'Total Perguntas',
        'Percentual Geral',
        'Classificação',
        'Prioridade',
        // Scores por seção (7 seções)
        'Gestão Financeira (%)',
        'Marketing (%)',
        'Experiência Paciente (%)',
        'Gestão Equipe (%)',
        'Tecnologia (%)',
        'Compliance (%)',
        'Estratégia (%)',
        // Gestão Financeira (8 perguntas)
        'Fin 1 - Controle mensal',
        'Fin 2 - Ticket médio',
        'Fin 3 - Indicadores financeiros',
        'Fin 4 - Serviços rentáveis',
        'Fin 5 - Precificação',
        'Fin 6 - Inadimplência',
        'Fin 7 - Reserva emergência',
        'Fin 8 - Análise viabilidade',
        // Marketing (8 perguntas)
        'Mkt 1 - Identidade visual',
        'Mkt 2 - Captação consistente',
        'Mkt 3 - Estratégia digital',
        'Mkt 4 - Taxa conversão',
        'Mkt 5 - Fidelização',
        'Mkt 6 - Redes sociais',
        'Mkt 7 - Marketing pago',
        'Mkt 8 - Reputação online',
        // Experiência Paciente (8 perguntas)
        'Exp 1 - Equipe treinada',
        'Exp 2 - Processos padronizados',
        'Exp 3 - Alta satisfação',
        'Exp 4 - Redução faltas',
        'Exp 5 - Diferencial competitivo',
        'Exp 6 - Pesquisas satisfação',
        'Exp 7 - Lembretes automáticos',
        'Exp 8 - Facilidades pagamento',
        // Gestão Equipe (8 perguntas)
        'Eq 1 - Indicadores performance',
        'Eq 2 - Reuniões periódicas',
        'Eq 3 - Protocolos claros',
        'Eq 4 - Equipe motivada',
        'Eq 5 - Independência operacional',
        'Eq 6 - Capacitação regular',
        'Eq 7 - Plano cargos salários',
        'Eq 8 - Baixa rotatividade',
        // Tecnologia (8 perguntas)
        'Tec 1 - Sistema integrado',
        'Tec 2 - Equipamentos modernos',
        'Tec 3 - Novas tecnologias',
        'Tec 4 - Backup dados',
        'Tec 5 - Comunicação digital',
        'Tec 6 - Site profissional',
        'Tec 7 - Telemedicina',
        'Tec 8 - Dashboards',
        // Compliance (8 perguntas)
        'Comp 1 - Normas CFM/CRM',
        'Comp 2 - Alvarás atualizados',
        'Comp 3 - Protocolos segurança',
        'Comp 4 - LGPD',
        'Comp 5 - Auditorias internas',
        'Comp 6 - Seguro responsabilidade',
        'Comp 7 - Documentação médica',
        'Comp 8 - Melhorias contínuas',
        // Estratégia (8 perguntas)
        'Est 1 - Metas claras',
        'Est 2 - Escalabilidade',
        'Est 3 - Posicionamento',
        'Est 4 - Planos expansão',
        'Est 5 - Próximos passos',
        'Est 6 - Análise concorrência',
        'Est 7 - Diversificação receita',
        'Est 8 - Visão longo prazo'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Formatar cabeçalhos
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground('#1e40af')
        .setFontColor('white')
        .setFontWeight('bold')
        .setFontSize(9);
        
      // Congelar primeira linha
      sheet.setFrozenRows(1);
      
      // Ajustar largura das colunas principais
      sheet.setColumnWidth(1, 150); // Data/Hora
      sheet.setColumnWidth(2, 200); // Nome
      sheet.setColumnWidth(3, 250); // Email
      sheet.setColumnWidth(4, 250); // Clínica
      sheet.setColumnWidth(5, 150); // Ramo
    }
    
    // Processar dados recebidos
    const data = JSON.parse(e.postData.contents);
    
    // Calcular pontuações por seção (7 seções com 8 perguntas cada)
    const sectionScores = [];
    const sectionPercentages = [];
    
    for (let secao = 0; secao < 7; secao++) {
      let score = 0;
      const itemsInSection = secao < 7 ? 8 : 8; // Todas as seções têm 8 perguntas
      
      for (let item = 0; item < itemsInSection; item++) {
        const key = `${secao}-${item}`;
        if (data.respostas[key]) score++;
      }
      
      const percentage = Math.round((score / itemsInSection) * 100);
      sectionScores.push(score);
      sectionPercentages.push(percentage);
    }
    
    // Determinar classificação e prioridade
    let classificacao = '';
    let prioridade = '';
    
    if (data.percentual <= 30) {
      classificacao = 'Crítico - Necessita Intervenção Imediata';
      prioridade = 'ALTA';
    } else if (data.percentual <= 50) {
      classificacao = 'Estágio Inicial - Grandes Oportunidades';
      prioridade = 'ALTA';
    } else if (data.percentual <= 70) {
      classificacao = 'Desenvolvimento - Boa Base para Crescer';
      prioridade = 'MÉDIA';
    } else {
      classificacao = 'Avançado - Pronto para Escalar';
      prioridade = 'BAIXA';
    }
    
    // Converter respostas do objeto para array (7 seções x 8 perguntas = 56 respostas)
    const respostas = [];
    for (let secao = 0; secao < 7; secao++) {
      for (let item = 0; item < 8; item++) {
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
      data.totalPerguntas,
      data.percentual + '%',
      classificacao,
      prioridade,
      ...sectionPercentages.map(p => p + '%'), // Percentuais por seção
      ...respostas // Todas as 56 respostas
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
    if (data.percentual > 50) corPontuacao = '#f59e0b'; // Amarelo
    if (data.percentual > 70) corPontuacao = '#16a34a'; // Verde
    
    sheet.getRange(nextRow, pontuacaoCol).setFontColor(corPontuacao).setFontWeight('bold');
    sheet.getRange(nextRow, 13).setFontColor(corPontuacao).setFontWeight('bold'); // Percentual
    
    // Destacar scores por seção (colunas P a V)
    for (let i = 0; i < 7; i++) {
      const colIndex = 16 + i; // Colunas P, Q, R, S, T, U, V
      const percentage = sectionPercentages[i];
      let corScore = '#dc2626'; // Vermelho para 0-40%
      if (percentage >= 41) corScore = '#f59e0b'; // Amarelo para 41-70%
      if (percentage >= 71) corScore = '#16a34a'; // Verde para 71-100%
      
      sheet.getRange(nextRow, colIndex).setFontColor(corScore).setFontWeight('bold');
    }
    
    // Adicionar estatísticas (se for a primeira linha de dados)
    if (nextRow === 2) {
      const statsRow = nextRow + 2;
      sheet.getRange(statsRow, 1).setValue('ESTATÍSTICAS GERAIS:').setFontWeight('bold').setFontSize(12);
      
      sheet.getRange(statsRow + 1, 1).setValue('Total Diagnósticos:');
      sheet.getRange(statsRow + 1, 2).setFormula('=COUNTA(A2:A1000)');
      
      sheet.getRange(statsRow + 2, 1).setValue('Média Pontuação:');
      sheet.getRange(statsRow + 2, 2).setFormula('=AVERAGE(K2:K1000)');
      
      sheet.getRange(statsRow + 3, 1).setValue('Média Percentual:');
      sheet.getRange(statsRow + 3, 2).setFormula('=AVERAGE(M2:M1000)');
      
      sheet.getRange(statsRow + 4, 1).setValue('Prioridade Alta:');
      sheet.getRange(statsRow + 4, 2).setFormula('=COUNTIF(O2:O1000,"ALTA")');
      
      sheet.getRange(statsRow + 5, 1).setValue('Prioridade Média:');
      sheet.getRange(statsRow + 5, 2).setFormula('=COUNTIF(O2:O1000,"MÉDIA")');
      
      sheet.getRange(statsRow + 6, 1).setValue('Prioridade Baixa:');
      sheet.getRange(statsRow + 6, 2).setFormula('=COUNTIF(O2:O1000,"BAIXA")');
      
      // Estatísticas por seção
      sheet.getRange(statsRow + 8, 1).setValue('MÉDIAS POR SEÇÃO:').setFontWeight('bold').setFontSize(12);
      const secoes = ['Gestão Financeira', 'Marketing', 'Experiência', 'Gestão Equipe', 'Tecnologia', 'Compliance', 'Estratégia'];
      
      for (let i = 0; i < 7; i++) {
        const col = String.fromCharCode(80 + i); // P, Q, R, S, T, U, V
        sheet.getRange(statsRow + 9 + i, 1).setValue(secoes[i] + ':');
        sheet.getRange(statsRow + 9 + i, 2).setFormula(`=AVERAGE(${col}2:${col}1000)`);
      }
    }
    
    // Retornar sucesso
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true, 
        row: nextRow,
        pontuacao: data.pontuacao,
        totalPerguntas: data.totalPerguntas,
        percentual: data.percentual,
        classificacao: classificacao,
        prioridade: prioridade,
        sectionScores: sectionPercentages
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

// Função para testar o script com dados expandidos
function testeExpandido() {
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
    pontuacao: 35,
    totalPerguntas: 56,
    percentual: 62,
    respostas: {
      // Gestão Financeira (5/8)
      '0-0': true, '0-1': true, '0-2': false, '0-3': true, '0-4': false, '0-5': true, '0-6': false, '0-7': true,
      // Marketing (6/8)
      '1-0': true, '1-1': false, '1-2': true, '1-3': true, '1-4': false, '1-5': true, '1-6': true, '1-7': false,
      // Experiência Paciente (7/8)
      '2-0': true, '2-1': true, '2-2': true, '2-3': false, '2-4': true, '2-5': true, '2-6': true, '2-7': true,
      // Gestão Equipe (4/8)
      '3-0': false, '3-1': true, '3-2': true, '3-3': false, '3-4': false, '3-5': true, '3-6': false, '3-7': true,
      // Tecnologia (5/8)
      '4-0': true, '4-1': false, '4-2': true, '4-3': true, '4-4': false, '4-5': true, '4-6': false, '4-7': true,
      // Compliance (4/8)
      '5-0': true, '5-1': true, '5-2': false, '5-3': false, '5-4': true, '5-5': false, '5-6': true, '5-7': false,
      // Estratégia (4/8)
      '6-0': true, '6-1': false, '6-2': true, '6-3': true, '6-4': false, '6-5': false, '6-6': true, '6-7': false
    }
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(dadosTeste)
    }
  };
  
  const resultado = doPost(e);
  console.log('Resultado do teste expandido:', resultado.getContent());
}

// Função para criar gráficos automáticos
function criarGraficosExpandidos() {
  const SHEET_ID = 'SEU_ID_DA_PLANILHA_AQUI';
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  
  // Gráfico de distribuição de percentuais
  const chartBuilder1 = sheet.newChart()
    .setChartType(Charts.ChartType.HISTOGRAM)
    .addRange(sheet.getRange('M2:M1000'))
    .setPosition(2, 30, 0, 0)
    .setOption('title', 'Distribuição de Percentuais Gerais')
    .setOption('width', 400)
    .setOption('height', 300);
    
  sheet.insertChart(chartBuilder1.build());
  
  // Gráfico de médias por seção
  const chartBuilder2 = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sheet.getRange('P2:V1000'))
    .setPosition(2, 35, 0, 0)
    .setOption('title', 'Performance Média por Seção')
    .setOption('width', 600)
    .setOption('height', 400);
    
  sheet.insertChart(chartBuilder2.build());
}

