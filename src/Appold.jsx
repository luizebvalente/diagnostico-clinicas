import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { CheckCircle, AlertCircle, TrendingUp, Stethoscope } from 'lucide-react'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    clinica: '',
    ramo: '',
    telefone: '',
    cidade: ''
  })
  const [checkedItems, setCheckedItems] = useState({})
  const [showResult, setShowResult] = useState(false)

  const diagnosticSections = [
    {
      title: "Gestão Financeira e Rentabilidade",
      items: [
        "Possuo controle mensal do faturamento, custos e lucro líquido",
        "Conheço o meu ticket médio e sei como aumentá-lo",
        "Tenho indicadores financeiros claros (DRE, fluxo de caixa, margem de lucro)",
        "Sei exatamente quais serviços/procedimentos são mais rentáveis",
        "Tenho estratégias de precificação bem definidas"
      ]
    },
    {
      title: "Marketing e Captação de Pacientes",
      items: [
        "Meu consultório tem uma identidade visual e posicionamento claros (branding)",
        "Consigo atrair pacientes de forma consistente, sem depender apenas de indicações",
        "Tenho uma estratégia digital (Instagram, Google, anúncios) com resultados mensuráveis",
        "Sei a taxa de conversão de leads (agendamentos x consultas realizadas)",
        "Tenho um plano para fidelização e reativação de pacientes"
      ]
    },
    {
      title: "Experiência do Paciente e Atendimento",
      items: [
        "Minha equipe é treinada para oferecer um atendimento humanizado e premium",
        "Temos processos padronizados de agendamento, confirmação e pós-consulta",
        "Pacientes têm alta taxa de retorno e recomendação (NPS)",
        "Existe um fluxo estruturado para reduzir faltas e cancelamentos",
        "Tenho clareza sobre como entregar uma experiência diferenciada ao paciente"
      ]
    },
    {
      title: "Gestão de Equipe e Processos Internos",
      items: [
        "Tenho indicadores de performance para recepcionistas, auxiliares e equipe",
        "Realizo reuniões periódicas de alinhamento e feedback com a equipe",
        "Existem protocolos claros para procedimentos e atendimento",
        "Sinto que minha equipe trabalha motivada e alinhada com os objetivos da clínica",
        "Não dependo exclusivamente de mim para que a clínica funcione bem"
      ]
    },
    {
      title: "Crescimento e Estratégia de Negócio",
      items: [
        "Tenho metas claras para os próximos 6 e 12 meses (faturamento, expansão, serviços)",
        "Sei como escalar meu consultório sem perder qualidade",
        "Tenho clareza sobre o meu posicionamento no mercado (público-alvo, diferenciais)",
        "Já possuo planos estruturados para novas parcerias ou novos serviços",
        "Sei qual é o próximo passo estratégico para aumentar meu faturamento"
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

  const getResultMessage = (score) => {
    if (score <= 10) {
      return {
        level: "Estágio Inicial",
        message: "A clínica está em estágio inicial de estruturação. Uma consultoria estratégica é altamente recomendada para organizar finanças, processos e marketing.",
        color: "destructive",
        icon: AlertCircle
      }
    } else if (score <= 20) {
      return {
        level: "Boa Base",
        message: "Há uma boa base, mas ainda existem lacunas que impedem crescimento consistente. Uma consultoria pode acelerar o processo e trazer mais resultados.",
        color: "secondary",
        icon: TrendingUp
      }
    } else {
      return {
        level: "Bem Estruturada",
        message: "A clínica já está estruturada, mas ainda pode melhorar posicionamento e eficiência. Consultoria focada em crescimento e escalabilidade pode ser o próximo passo.",
        color: "default",
        icon: CheckCircle
      }
    }
  }

  const handleSubmit = () => {
    const score = calculateScore()
    console.log('Dados do formulário:', formData)
    console.log('Pontuação:', score)
    console.log('Itens marcados:', checkedItems)
    setShowResult(true)
  }

  const isFormValid = formData.nome && formData.email && formData.clinica && formData.ramo

  if (showResult) {
    const score = calculateScore()
    const result = getResultMessage(score)
    const ResultIcon = result.icon

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Stethoscope className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resultado do Diagnóstico</h1>
            <p className="text-gray-600">Análise completa da sua clínica</p>
          </div>

          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <ResultIcon className="h-16 w-16 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Pontuação: {score}/25</CardTitle>
              <Badge variant={result.color} className="text-lg px-4 py-2">
                {result.level}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Progress value={(score / 25) * 100} className="h-3" />
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {Math.round((score / 25) * 100)}% dos critérios atendidos
                </p>
              </div>
              <p className="text-lg text-center text-gray-700 leading-relaxed">
                {result.message}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados da Clínica</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Button onClick={() => {
              setShowResult(false)
              setCurrentStep(1)
              setFormData({
                nome: '',
                email: '',
                clinica: '',
                ramo: '',
                telefone: '',
                cidade: ''
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
            Diagnóstico de Necessidade de Consultoria
          </h1>
          <p className="text-gray-600">Clínicas e Consultórios Médicos</p>
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Dados da Clínica</CardTitle>
              <CardDescription>
                Preencha as informações básicas para começarmos o diagnóstico
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
              <h2 className="text-2xl font-semibold mb-2">Questionário de Diagnóstico</h2>
              <p className="text-gray-600">
                Marque os itens que se aplicam à sua clínica atualmente
              </p>
            </div>

            {diagnosticSections.map((section, sectionIndex) => (
              <Card key={sectionIndex}>
                <CardHeader>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
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
            ))}

            <div className="flex justify-between pt-4">
              <Button 
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Voltar
              </Button>
              <Button onClick={handleSubmit}>
                Ver Resultado
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

