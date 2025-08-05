import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { CheckCircle, AlertCircle, TrendingUp, Stethoscope, Save, Target, Users, DollarSign, BarChart3, Lightbulb, Calendar, Phone, Mail, MapPin } from 'lucide-react'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    clinica: '',
    ramo: '',
    telefone: '',
    cidade: '',
    faturamentoMensal: '',
    numeroFuncionarios: '',
    tempoMercado: ''
  })
  const [checkedItems, setCheckedItems] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // CONFIGURAÇÃO GOOGLE SHEETS
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxJyUZk9BlYQIRqvTzdtrgEPw8-r-8muXl0BWxda9y9sSpnsFXuFqD8ZnSvkiDJAk13/exec'

  const diagnosticSections = [
    {
      title: "Gestão Financeira e Rentabilidade",
      icon: DollarSign,
      items: [
        "Possuo controle mensal detalhado do faturamento, custos e lucro líquido",
        "Conheço o meu ticket médio por paciente e tenho estratégias para aumentá-lo",
        "Tenho indicadores financeiros claros (DRE, fluxo de caixa, margem de lucro) atualizados mensalmente",
        "Sei exatamente quais serviços/procedimentos são mais rentáveis e foco neles",
        "Tenho estratégias de precificação bem definidas baseadas em custos e valor percebido"
      ]
    },
    {
      title: "Marketing e Captação de Pacientes",
      icon: Target,
      items: [
        "Minha clínica tem identidade visual profissional e posicionamento claro no mercado",
        "Consigo atrair novos pacientes consistentemente através de múltiplos canais",
        "Tenho estratégia digital ativa (site, redes sociais, Google) com resultados mensuráveis",
        "Monitoro e conheço minha taxa de conversão de leads em consultas efetivas",
        "Possuo sistema estruturado de fidelização e reativação de pacientes inativos"
      ]
    },
    {
      title: "Experiência do Paciente e Atendimento",
      icon: Users,
      items: [
        "Minha equipe é treinada regularmente para oferecer atendimento humanizado e premium",
        "Temos processos padronizados para agendamento, confirmação, atendimento e pós-consulta",
        "Pacientes demonstram alta satisfação com taxa de retorno superior a 80%",
        "Existe fluxo estruturado e eficaz para reduzir faltas e cancelamentos de última hora",
        "Tenho clareza sobre meu diferencial competitivo na experiência do paciente"
      ]
    },
    {
      title: "Gestão de Equipe e Processos Internos",
      icon: BarChart3,
      items: [
        "Tenho indicadores de performance claros para recepcionistas, auxiliares e toda equipe",
        "Realizo reuniões periódicas de alinhamento, feedback e desenvolvimento da equipe",
        "Existem protocolos documentados e claros para todos os procedimentos e atendimentos",
        "Minha equipe trabalha motivada, engajada e alinhada com os objetivos da clínica",
        "A clínica funciona eficientemente mesmo quando não estou presente"
      ]
    },
    {
      title: "Crescimento e Estratégia de Negócio",
      icon: TrendingUp,
      items: [
        "Tenho metas claras e mensuráveis para os próximos 6, 12 e 24 meses",
        "Sei como escalar minha clínica mantendo ou melhorando a qualidade do atendimento",
        "Tenho clareza total sobre meu posicionamento, público-alvo e diferenciais competitivos",
        "Possuo planos estruturados para novas parcerias, serviços ou expansão",
        "Conheço exatamente os próximos passos estratégicos para aumentar meu faturamento"
      ]
    }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (sectionIndex, itemIndex, checked) => {
    const key = `${sectionIndex}-${itemIndex}`
    setCheckedItems(prev => ({ ...prev, [key]: checked }))
  }

  const calculateScore = () => {
    return Object.values(checkedItems).filter(Boolean).length
  }

  const calculateSectionScores = () => {
    const sectionScores = []
    for (let i = 0; i < 5; i++) {
      let sectionScore = 0
      for (let j = 0; j < 5; j++) {
        const key = `${i}-${j}`
        if (checkedItems[key]) sectionScore++
      }
      sectionScores.push(sectionScore)
    }
    return sectionScores
  }

  const getDetailedAnalysis = (score, sectionScores) => {
    const analysis = {
      nivel: "",
      prioridade: "",
      pontosFracos: [],
      pontosFortes: [],
      riscos: [],
      oportunidades: [],
      planoAcao: []
    }

    // Análise geral
    if (score <= 8) {
      analysis.nivel = "Crítico - Necessita Intervenção Imediata"
      analysis.prioridade = "ALTA"
      analysis.riscos = [
        "Risco alto de insustentabilidade financeira",
        "Dependência excessiva do proprietário",
        "Falta de controle operacional e financeiro",
        "Dificuldade para competir no mercado"
      ]
    } else if (score <= 15) {
      analysis.nivel = "Estágio Inicial - Grandes Oportunidades"
      analysis.prioridade = "ALTA"
      analysis.riscos = [
        "Crescimento limitado sem estruturação",
        "Perda de oportunidades de mercado",
        "Gestão reativa ao invés de proativa"
      ]
    } else if (score <= 20) {
      analysis.nivel = "Desenvolvimento - Boa Base para Crescer"
      analysis.prioridade = "MÉDIA"
      analysis.oportunidades = [
        "Potencial para acelerar crescimento",
        "Base sólida para expansão",
        "Oportunidade de se destacar da concorrência"
      ]
    } else {
      analysis.nivel = "Avançado - Pronto para Escalar"
      analysis.prioridade = "BAIXA"
      analysis.oportunidades = [
        "Excelente posição para expansão",
        "Potencial para se tornar referência no mercado",
        "Oportunidade de diversificação de serviços"
      ]
    }

    // Análise por seção
    const sectionNames = ["Gestão Financeira", "Marketing", "Experiência do Paciente", "Gestão de Equipe", "Estratégia de Negócio"]
    
    sectionScores.forEach((sectionScore, index) => {
      if (sectionScore <= 2) {
        analysis.pontosFracos.push(sectionNames[index])
      } else if (sectionScore >= 4) {
        analysis.pontosFortes.push(sectionNames[index])
      }
    })

    return analysis
  }

  const getYounvActionPlan = (score, sectionScores, formData) => {
    const plans = []
    const sectionNames = ["Gestão Financeira", "Marketing", "Experiência do Paciente", "Gestão de Equipe", "Estratégia de Negócio"]
    
    // Plano baseado na pontuação geral
    if (score <= 8) {
      plans.push({
        fase: "FASE 1 - Estabilização (30 dias)",
        objetivo: "Criar base sólida para operação sustentável",
        acoes: [
          "Implementar controle financeiro básico (DRE simplificado)",
          "Definir processos essenciais de atendimento",
          "Estabelecer metas de faturamento realistas",
          "Treinar equipe em atendimento básico"
        ],
        investimento: "R$ 2.500 - R$ 5.000",
        roi: "Redução de 30% nos custos operacionais"
      })
      
      plans.push({
        fase: "FASE 2 - Estruturação (60 dias)",
        objetivo: "Organizar operações e iniciar crescimento",
        acoes: [
          "Criar sistema de gestão de pacientes",
          "Desenvolver identidade visual básica",
          "Implementar estratégias de retenção",
          "Estabelecer indicadores de performance"
        ],
        investimento: "R$ 3.000 - R$ 7.000",
        roi: "Aumento de 25% no faturamento"
      })
    } else if (score <= 15) {
      plans.push({
        fase: "FASE 1 - Otimização (45 dias)",
        objetivo: "Melhorar eficiência e resultados atuais",
        acoes: [
          "Aprimorar controles financeiros existentes",
          "Implementar estratégias de marketing digital",
          "Padronizar processos de atendimento",
          "Criar sistema de gestão de equipe"
        ],
        investimento: "R$ 4.000 - R$ 8.000",
        roi: "Aumento de 35% na margem de lucro"
      })
      
      plans.push({
        fase: "FASE 2 - Expansão (90 dias)",
        objetivo: "Acelerar crescimento e captar novos pacientes",
        acoes: [
          "Lançar campanhas de marketing direcionadas",
          "Implementar programa de fidelização",
          "Expandir serviços ou horários de atendimento",
          "Desenvolver parcerias estratégicas"
        ],
        investimento: "R$ 5.000 - R$ 12.000",
        roi: "Aumento de 50% no número de pacientes"
      })
    } else {
      plans.push({
        fase: "FASE 1 - Escalabilidade (60 dias)",
        objetivo: "Preparar estrutura para crescimento acelerado",
        acoes: [
          "Implementar sistemas avançados de gestão",
          "Criar estratégias de marketing premium",
          "Desenvolver novos serviços/especialidades",
          "Estruturar modelo de franquia ou expansão"
        ],
        investimento: "R$ 8.000 - R$ 15.000",
        roi: "Aumento de 70% no faturamento"
      })
    }

    // Planos específicos por área fraca
    sectionScores.forEach((sectionScore, index) => {
      if (sectionScore <= 2) {
        switch(index) {
          case 0: // Gestão Financeira
            plans.push({
              fase: "PLANO ESPECÍFICO - Gestão Financeira",
              objetivo: "Implementar controle financeiro profissional",
              acoes: [
                "Implementar software de gestão financeira",
                "Criar relatórios gerenciais mensais",
                "Definir precificação estratégica",
                "Estabelecer reservas de emergência"
              ],
              investimento: "R$ 2.000 - R$ 4.000",
              roi: "Redução de 40% nos custos desnecessários"
            })
            break
          case 1: // Marketing
            plans.push({
              fase: "PLANO ESPECÍFICO - Marketing Digital",
              objetivo: "Criar presença digital forte e atrair pacientes",
              acoes: [
                "Desenvolver site profissional otimizado",
                "Criar estratégia de redes sociais",
                "Implementar Google Ads e SEO",
                "Desenvolver programa de indicações"
              ],
              investimento: "R$ 3.000 - R$ 6.000",
              roi: "Aumento de 60% em novos pacientes"
            })
            break
          case 2: // Experiência do Paciente
            plans.push({
              fase: "PLANO ESPECÍFICO - Experiência do Paciente",
              objetivo: "Criar experiência excepcional e fidelizar pacientes",
              acoes: [
                "Treinar equipe em atendimento premium",
                "Implementar sistema de feedback",
                "Criar jornada do paciente otimizada",
                "Desenvolver programa de fidelização"
              ],
              investimento: "R$ 2.500 - R$ 5.000",
              roi: "Aumento de 45% na retenção de pacientes"
            })
            break
        }
      }
    })

    return plans
  }

  // Função para salvar no Google Sheets
  const saveToGoogleSheets = async (data) => {
    try {
      setIsSaving(true)
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar os dados. Verifique a configuração do Google Sheets.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async () => {
    const score = calculateScore()
    const sectionScores = calculateSectionScores()
    
    // Preparar dados para salvar
    const dataToSave = {
      timestamp: new Date().toISOString(),
      nome: formData.nome,
      email: formData.email,
      clinica: formData.clinica,
      ramo: formData.ramo,
      telefone: formData.telefone || '',
      cidade: formData.cidade || '',
      faturamentoMensal: formData.faturamentoMensal || '',
      numeroFuncionarios: formData.numeroFuncionarios || '',
      tempoMercado: formData.tempoMercado || '',
      pontuacao: score,
      percentual: Math.round((score / 25) * 100),
      pontuacaoSecoes: sectionScores,
      respostas: checkedItems
    }

    console.log('Dados do diagnóstico 360°:', dataToSave)
    
    // Salvar no Google Sheets
    await saveToGoogleSheets(dataToSave)
    
    setShowResult(true)
  }

  const isFormValid = formData.nome && formData.email && formData.clinica && formData.ramo

  if (showResult) {
    const score = calculateScore()
    const sectionScores = calculateSectionScores()
    const analysis = getDetailedAnalysis(score, sectionScores)
    const actionPlans = getYounvActionPlan(score, sectionScores, formData)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Stethoscope className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnóstico 360° Completo</h1>
            <p className="text-gray-600">Análise detalhada e plano de ação personalizado</p>
            
            {saveSuccess && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center justify-center">
                <Save className="h-5 w-5 mr-2" />
                Dados salvos com sucesso!
              </div>
            )}
          </div>

          {/* Pontuação Geral */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">Pontuação Geral: {score}/25</CardTitle>
              <div className="flex justify-center mb-4">
                <Badge 
                  variant={score <= 8 ? "destructive" : score <= 15 ? "secondary" : score <= 20 ? "default" : "default"}
                  className="text-lg px-6 py-2"
                >
                  {analysis.nivel}
                </Badge>
              </div>
              <Progress value={(score / 25) * 100} className="h-4 mb-2" />
              <p className="text-sm text-gray-600">
                {Math.round((score / 25) * 100)}% dos critérios de excelência atendidos
              </p>
            </CardHeader>
          </Card>

          {/* Análise Detalhada */}
          <Tabs defaultValue="analise" className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analise">Análise 360°</TabsTrigger>
              <TabsTrigger value="setores">Por Setor</TabsTrigger>
              <TabsTrigger value="plano">Plano de Ação</TabsTrigger>
              <TabsTrigger value="younv">Younv Consultoria</TabsTrigger>
            </TabsList>

            {/* Tab Análise 360° */}
            <TabsContent value="analise">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Pontos Fortes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysis.pontosFortes.length > 0 ? (
                      <ul className="space-y-2">
                        {analysis.pontosFortes.map((ponto, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {ponto}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">Nenhum ponto forte identificado. Foco total na estruturação básica.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Áreas Críticas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysis.pontosFracos.length > 0 ? (
                      <ul className="space-y-2">
                        {analysis.pontosFracos.map((ponto, index) => (
                          <li key={index} className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                            {ponto}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">Parabéns! Nenhuma área crítica identificada.</p>
                    )}
                  </CardContent>
                </Card>

                {analysis.riscos.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-orange-600">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Riscos Identificados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.riscos.map((risco, index) => (
                          <li key={index} className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                            {risco}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {analysis.oportunidades.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-600">
                        <Lightbulb className="h-5 w-5 mr-2" />
                        Oportunidades
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.oportunidades.map((oportunidade, index) => (
                          <li key={index} className="flex items-center">
                            <Lightbulb className="h-4 w-4 text-blue-500 mr-2" />
                            {oportunidade}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Tab Por Setor */}
            <TabsContent value="setores">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diagnosticSections.map((section, index) => {
                  const SectionIcon = section.icon
                  const sectionScore = sectionScores[index]
                  const percentage = (sectionScore / 5) * 100
                  
                  return (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <SectionIcon className="h-4 w-4 mr-2" />
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-2">{sectionScore}/5</div>
                          <Progress value={percentage} className="h-2 mb-2" />
                          <Badge 
                            variant={sectionScore <= 2 ? "destructive" : sectionScore <= 3 ? "secondary" : "default"}
                            className="text-xs"
                          >
                            {sectionScore <= 2 ? "Crítico" : sectionScore <= 3 ? "Básico" : "Bom"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Tab Plano de Ação */}
            <TabsContent value="plano">
              <div className="space-y-6">
                {actionPlans.map((plan, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        {plan.fase}
                      </CardTitle>
                      <CardDescription>{plan.objetivo}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Ações Prioritárias:</h4>
                          <ul className="space-y-1">
                            {plan.acoes.map((acao, actionIndex) => (
                              <li key={actionIndex} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                <span className="text-sm">{acao}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm"><strong>Investimento:</strong> {plan.investimento}</p>
                            <p className="text-sm"><strong>ROI Esperado:</strong> {plan.roi}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab Younv Consultoria */}
            <TabsContent value="younv">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-blue-600">Younv Consultoria</CardTitle>
                  <CardDescription className="text-lg">
                    Especialistas em Transformação de Clínicas Médicas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Por que escolher a Younv?</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                          <span><strong>Especialização:</strong> Mais de 500 clínicas transformadas</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                          <span><strong>Resultados:</strong> Aumento médio de 60% no faturamento</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                          <span><strong>Metodologia:</strong> Diagnóstico 360° + Plano personalizado</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                          <span><strong>Suporte:</strong> Acompanhamento completo durante todo processo</span>
                        </li>
                      </ul>

                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Próximos Passos:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                          <li>Consultoria gratuita de 30 minutos</li>
                          <li>Análise detalhada da sua clínica</li>
                          <li>Proposta personalizada</li>
                          <li>Início da transformação</li>
                        </ol>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-center">Entre em Contato Direto</h3>
                      
                      <div className="text-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg inline-block">
                          <img 
                            src="/qrcode-whatsapp.jpeg" 
                            alt="QR Code WhatsApp Younv Consultoria" 
                            className="w-48 h-48 mx-auto mb-4"
                          />
                          <div className="space-y-2">
                            <p className="font-semibold text-lg text-gray-800">
                              Escaneie o QR Code
                            </p>
                            <p className="text-sm text-gray-600">
                              Fale direto conosco pelo WhatsApp
                            </p>
                            <p className="text-xs text-gray-500">
                              (14) 99602-6013
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 mb-4">
                          Ou clique no botão abaixo para abrir o WhatsApp
                        </p>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700" 
                          size="lg"
                          onClick={() => window.open('https://wa.me/5514996026013?text=Olá! Vi o diagnóstico 360° e gostaria de agendar uma consultoria gratuita.', '_blank')}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Abrir WhatsApp Direto
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Dados da Clínica */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Dados da Clínica Analisada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p><strong>Responsável:</strong> {formData.nome}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Clínica:</strong> {formData.clinica}</p>
                </div>
                <div>
                  <p><strong>Ramo:</strong> {formData.ramo}</p>
                  {formData.telefone && <p><strong>Telefone:</strong> {formData.telefone}</p>}
                  {formData.cidade && <p><strong>Cidade:</strong> {formData.cidade}</p>}
                </div>
                <div>
                  {formData.faturamentoMensal && <p><strong>Faturamento:</strong> {formData.faturamentoMensal}</p>}
                  {formData.numeroFuncionarios && <p><strong>Funcionários:</strong> {formData.numeroFuncionarios}</p>}
                  {formData.tempoMercado && <p><strong>Tempo no Mercado:</strong> {formData.tempoMercado}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={() => {
              setShowResult(false)
              setCurrentStep(1)
              setFormData({
                nome: '',
                email: '',
                clinica: '',
                ramo: '',
                telefone: '',
                cidade: '',
                faturamentoMensal: '',
                numeroFuncionarios: '',
                tempoMercado: ''
              })
              setCheckedItems({})
            }}>
              Fazer Novo Diagnóstico
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Stethoscope className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Diagnóstico 360° - Younv Consultoria
          </h1>
          <p className="text-gray-600">Análise completa para transformar sua clínica</p>
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Dados da Clínica</CardTitle>
              <CardDescription>
                Preencha as informações para uma análise mais precisa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome do Responsável *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="clinica">Nome da Clínica *</Label>
                  <Input
                    id="clinica"
                    value={formData.clinica}
                    onChange={(e) => handleInputChange('clinica', e.target.value)}
                    placeholder="Nome da sua clínica"
                  />
                </div>
                <div>
                  <Label htmlFor="ramo">Ramo de Atuação *</Label>
                  <Input
                    id="ramo"
                    value={formData.ramo}
                    onChange={(e) => handleInputChange('ramo', e.target.value)}
                    placeholder="Ex: Cardiologia, Dermatologia, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade/Estado</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                    placeholder="São Paulo/SP"
                  />
                </div>
                <div>
                  <Label htmlFor="faturamentoMensal">Faturamento Mensal Aproximado</Label>
                  <Input
                    id="faturamentoMensal"
                    value={formData.faturamentoMensal}
                    onChange={(e) => handleInputChange('faturamentoMensal', e.target.value)}
                    placeholder="Ex: R$ 50.000"
                  />
                </div>
                <div>
                  <Label htmlFor="numeroFuncionarios">Número de Funcionários</Label>
                  <Input
                    id="numeroFuncionarios"
                    value={formData.numeroFuncionarios}
                    onChange={(e) => handleInputChange('numeroFuncionarios', e.target.value)}
                    placeholder="Ex: 5 funcionários"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="tempoMercado">Tempo no Mercado</Label>
                  <Input
                    id="tempoMercado"
                    value={formData.tempoMercado}
                    onChange={(e) => handleInputChange('tempoMercado', e.target.value)}
                    placeholder="Ex: 3 anos"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => setCurrentStep(2)}
                  disabled={!isFormValid}
                >
                  Continuar para o Diagnóstico
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Questionário de Diagnóstico 360°</h2>
              <p className="text-gray-600">
                Marque os itens que se aplicam à sua clínica atualmente
              </p>
            </div>

            {diagnosticSections.map((section, sectionIndex) => {
              const SectionIcon = section.icon
              return (
                <Card key={sectionIndex}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <SectionIcon className="h-5 w-5 mr-2" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.items.map((item, itemIndex) => {
                        const key = `${sectionIndex}-${itemIndex}`
                        return (
                          <div key={itemIndex} className="flex items-start space-x-3">
                            <Checkbox
                              id={key}
                              checked={checkedItems[key] || false}
                              onCheckedChange={(checked) => 
                                handleCheckboxChange(sectionIndex, itemIndex, checked)
                              }
                            />
                            <Label 
                              htmlFor={key} 
                              className="text-sm leading-relaxed cursor-pointer"
                            >
                              {item}
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            <div className="flex justify-between pt-4">
              <Button 
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Voltar
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSaving}
                size="lg"
              >
                {isSaving ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Gerar Diagnóstico 360°'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

