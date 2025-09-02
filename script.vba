'
'*** Variaveis para ser usada em
'todas as macros desse modullo.******
'

'*************************************************
'********                             ************
'******** VARIAVEIS DO PARA SIMULADOR ************
'********                             ************
'*************************************************
Dim driver As ChromeDriver ' essa È a ChromeDriver para abrir NAVEGADOR
Dim NomeArquivo As String


        Dim CategoriaImovel As String
        Dim Construtora As String
        Dim NomeImovel As String
        Dim Cidade As String
        Dim Endereco As String
        Dim DataEntrega As Date
        Dim RENDA As String
        Dim NomeClienteSimulacao As String

        
        'Variavel Currency para usar como MOEDA
        Dim valorImovel As Currency
        
        Dim PrestacaoSIRIC As String
        Dim Avaliacao As String
        Dim DataNascimento As String
        Dim Tres_Anos As String
        Dim Dependente As String
        Dim FAIXA, OrigemRecurso As String
        Dim ContDepen As Integer
        Dim Cont As Integer
        Dim NumeroResultados As Integer
        Dim Mensais As String
        Dim PrazoObra As String
        Dim linha As String
        Dim LINHA2 As String
        Dim tabela, TabelaResult As String
        Dim AreaUtil As String
        
        Dim subsidio As Long
        Dim PrestaÁ„o As Integer
        Dim valorFinanciamento As Long
'
'*************************************************
'*************************************************
'*************************************************

Public Sub ConfirmarDados()

NomeArquivo = Application.ThisWorkbook.Name
Dim Message, Title, Default, MyValue


    Dim LimparSimulaÁıes As VbMsgBoxResult
    LimparSimulaÁıes = MsgBox("LIMPAR RESULTADOS DE SIMULA«’ES ANTERIORES?", vbYesNo, "LIMPAR DADOS")
   
    If LimparSimulaÁıes = vbYes Then
        'Limpart todos os dados da Planilha
        Workbooks(NomeArquivo).Sheets("Resultados").Range("BQ9:CD200").ClearContents
        'Recebe o valor correspondente a Primeira Linha dos Resultados
        LINHA2 = 9
        NumeroResultados = 1
    Else
        'Verifica a linha do ˙ltimo resultado de simulaÁ„o
        LINHA2 = Workbooks(NomeArquivo).Sheets("Resultados").Range("BQ1048576").End(xlUp).Row
        'Verifica ˙ltimo cÛdigo de resultado da simulaÁ„os
        NumeroResultados = Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 69) + 1
        'Captura a ˙ltima linha vazinha nos campos dos resultados
        LINHA2 = Workbooks(NomeArquivo).Sheets("Resultados").Range("BQ1048576").End(xlUp).Row + 1
    End If
    
    '******************************************************
    'Confirma se tem algum imÛvel selecionado para Simular
    '******************************************************
    If WorksheetFunction.CountA(Range("B9:B200")) = 0 Then
    MsgBox "Por favor Selecione os ImÛveis"
    FaltaPreencher = 1
    Exit Sub
    End If


'Seleciona a celula da RENDA
Workbooks(NomeArquivo).Sheets("Simulador").Range("C8").Select

'*****************************************************************************
'lopping das linhas VERIFICAR ELE SELECIONOU ALGUM COM FGTS COM RENDA SBPE
'*********************************************************************
Do While ActiveCell <> ""


linha = ActiveCell.Row

    If Sheets("Simulador").Cells(linha, 2) <> "" Then
        If Sheets("Simulador").Cells(linha, 5) = "FGTS" Then
            If Workbooks(NomeArquivo).Sheets("Simulador").Range("D3") > "7999,99" Then
             MsgBox "Cliente tem renda acima de R$ 8.000,00, Ele sÛ se enquadra nos empreendimentos SBPE", vbExclamation, "RENDA SBPE"
             Workbooks(NomeArquivo).Sheets("Simulador").Range("B9:B200").ClearContents
             Workbooks(NomeArquivo).Sheets("Simulador").Range("B9").Select
             Exit Sub
         End If
        End If
    End If

'Faz o loop para saber se tem mais algum para simular
ActiveCell.Offset(1, 0).Select
Loop

'--------------------------------------------------------------------------------

'*********************************************************************************
'*********************************************************************************

    If Workbooks(NomeArquivo).Sheets("Simulador").Range("D3") = "" Then
    MsgBox "Por favor preencha o valor da renda"
    Exit Sub
    End If
    
    
    If Workbooks(NomeArquivo).Sheets("Simulador").Range("F3") = "" Then
    MsgBox "Por favor preencha o Valor do FGTS ou Deixe Zerado"
    Exit Sub
    End If
    
    If Workbooks(NomeArquivo).Sheets("Simulador").Range("D5") = "" Then
    MsgBox "Por favor preencha o a data de nascimento"
    Exit Sub
    End If
    
    If Workbooks(NomeArquivo).Sheets("Simulador").Range("H4") = "" Then
    MsgBox "Por favor informe se tem 3 anos de FGTS"
    Exit Sub
    End If
    
    If Workbooks(NomeArquivo).Sheets("Simulador").Range("H4") <> "SIM" Then
    
        If Workbooks(NomeArquivo).Sheets("Simulador").Range("H4") <> "N√O" Then
        MsgBox "Por favor preecha se tem 3 ANOS DE CARTEIRA ASSINADA COM ( SIM OU N√O )"
        'Exit Sub
        End If
    
    End If
    
    If Workbooks(NomeArquivo).Sheets("Simulador").Range("H5") = "" Then
    MsgBox "Por favor informe se tem dependente"
   ' Exit Sub
    End If
    
    If Workbooks(NomeArquivo).Sheets("Simulador").Range("H5") <> "SIM" Then
    
        If Workbooks(NomeArquivo).Sheets("Simulador").Range("H5") <> "N√O" Then
        MsgBox "Por favor preecha se tem DEPENDENTE COM ( SIM OU N√O )"
        'Exit Sub
        End If
    
    End If


'*********************************************************************************
'*********************************************************************************

Message = "Digite o nome do Cliente"    ' Set prompt.
Title = "Qual nome do CLiente?"    ' Set title.
'Default = "1"    ' Set default.
' Display message, title, and default value.
NomeClienteSimulacao = InputBox(Message, Title, Default)

If NomeClienteSimulacao <> "" Then

    'Workbooks(NomeArquivo).Sheets("Resultados").Range("G8") = NomeClienteSimulacao
    Workbooks(NomeArquivo).Sheets("Simulador").Range("C9").Select
    'MsgBox "Executa"
    
    Call AbrirChromeSimulador


Else

MsgBox "Por favor Preencha o Nome do Cliente"
Exit Sub
End If


End Sub

Sub AbrirChromeSimulador()
        

    
        On Error Resume Next

        '   Vai ABRIR Google Chrome como Pagina TESTE
        'para executar todas a macro completa do Selenium......
        Set driver = New ChromeDriver
 
        'driver.get - … o que vai abrir o link do site.
        driver.Get "https://www.portaldeempreendimentos.caixa.gov.br/simulador/"
        
         Workbooks(NomeArquivo).Sheets("Simulador").Range("A1") = Err.Number
         
         'MsgBox Err.number
        
        'VERIFICA SE VERS√O DO CHROME DRIVER ESTA DESATULIZADA**********************************************
         If Err.Number = 33 Then
            MsgBox "ERRO. A VERS√O DO CHROME DRIVER ESTA DESATUALIZADA", vbCritical, "VERS√O DESATUALIZADA"
           ' Exit Sub
         End If
        '*****************************************************************************************************
        
        'VERIFICA SE VERS√O DO CHROME DRIVER ESTA DESATULIZADA**********************************************
         If Err.Number = 13 Then
            MsgBox "Erro no ( NET. framework 3.5 ), desativado", vbCritical, "VERS√O DESATUALIZADA"
            'Exit Sub
         End If
        '*****************************************************************************************************

         'VERIFICA SE O FRAMEWORK ESTA INSTALADO NA MAQUINA***************
         If Err.Number = "-2146232576(801311700)" Then
            'MsgBox "Microsoft .NET Framework 3.5, DEVE SER INSTALADO OU ATIVADO!", vbCritical, "ARQUIVO AUSENTE"
            'Exit Sub
         End If
         '****************************************************************************************************
         
        
         
         'Call ModuloSeguranca
        Call SimuladorNew

End Sub

Sub FecharChrome()

driver.Quit

Unload Form_Carregando


End Sub

Sub ModuloSeguranca()


'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR SIMULADOR--------------------------------------------------------------------
'Loop para esperar o numero carregar
Dim por As New By

Do While driver.IsElementPresent(por.XPath("//*[@id=""details-button""]")) = False

If Cont > 15 Then
MsgBox "Simulador travou. SeÁ„o ( MODULO SEGURAN«A )", vbInformation
Exit Do
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------
On Error GoTo final

driver.FindElementById("details-button").Click
fazer (1000)
driver.FindElementById("proceed-link").Click

final:
Call SimuladorNew

End Sub


'***************************************************************
'**************************           **************************
'************************** SIMULADOR **************************
'**************************           **************************
'***************************************************************

Sub SimuladorNew()

NomeArquivo = Application.ThisWorkbook.Name

'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR SIMULADOR--------------------------------------------------------------------
'Loop para esperar o numero carregar
Dim por As New By

Do While driver.IsElementPresent(por.XPath("//*[@id=""origemRecurso""]")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( ORIGEM DE RECURSOS )", vbInformation
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------





ContDepen = 0
Cont = 0
'LINHA2 = 9
'NumeroResultados = 1


RENDA = Workbooks(NomeArquivo).Sheets("Simulador").Range("D3")          'Renda do Cliente
RENDA = Format(RENDA, "##.,00")
PrestacaoSIRIC = Workbooks(NomeArquivo).Sheets("Simulador").Range("F5") 'PrestaÁ„o Maxima do SIRIC
PrestacaoSIRIC = Format(PrestacaoSIRIC, "##.,00")
Tres_Anos = Workbooks(NomeArquivo).Sheets("Simulador").Range("H4")      'Se o cliente possui 3 anos
Dependente = Workbooks(NomeArquivo).Sheets("Simulador").Range("H5")     'Se tem dependente
DataNascimento = Workbooks(NomeArquivo).Sheets("Simulador").Range("D5") 'Data de Nascimento
tabela = Workbooks(NomeArquivo).Sheets("Simulador").Range("H3")         'PRICE OU SAC

'Limpart todos os dados da Planilha
'Workbooks(NomeArquivo).Sheets("Resultados").Range("w9:gv200").ClearContents

'Seleciona a celula para comeÁar o loop nos imoveis
Workbooks(NomeArquivo).Sheets("Simulador").Range("C9").Select

'lopping das linhas
Do While ActiveCell <> ""


linha = ActiveCell.Row

        
    If Sheets("Simulador").Cells(linha, 2) <> "" Then
        
        'Capturas os dados do imÛvel **************************************************
        '
        Construtora = Workbooks(NomeArquivo).Sheets("Simulador").Cells(linha, 3)    'Construtora
        NomeImovel = Workbooks(NomeArquivo).Sheets("Simulador").Cells(linha, 4)     'Nome do Empreendimento
        'FAIXA = Sheets("Simulador").Cells(linha, 4)                                 'Faixa do MCMV
        FAIXA = 2                                                                   'Faixa do MCMV
        OrigemRecurso = Sheets("Simulador").Cells(linha, 5)                         'Origem do Recursos
        DataEntrega = Sheets("Simulador").Cells(linha, 6)                           'Data de Entrega
        Mensais = Workbooks(NomeArquivo).Sheets("Simulador").Cells(linha, 7)        'Mensais
        Avaliacao = Workbooks(NomeArquivo).Sheets("Simulador").Cells(linha, 8)      'AvaliaÁ„o
        Avaliacao = Format(Avaliacao, "##.,00")
        valorImovel = Workbooks(NomeArquivo).Sheets("Simulador").Cells(linha, 9)    'Valor do ImÛvel
        Cidade = Sheets("Simulador").Cells(linha, 10)                               'Cidade
        AreaUtil = Workbooks(NomeArquivo).Sheets("Simulador").Cells(linha, 11)      'LocalizaÁ„o
        PrazoObra = Workbooks(NomeArquivo).Sheets("Simulador").Cells(linha, 12)     'Prazo Obra
        If PrazoObra = "PRONTO MORAR" Then
            PrazoObra = 3
        End If
        
        CategoriaImovel = "CONSTRUCAO/AQ TER CONST - IM. PLANTA E COLETIVAS"        'Categoria do ImÛvel
        
        
        
        
            
            If OrigemRecurso = "FGTS" Or OrigemRecurso = "FAIXA 3" Then
                If OrigemRecurso = "FGTS" Then
                    FAIXA = "FAIXA 2"
                ElseIf OrigemRecurso = "FAIXA 3" Then
                    FAIXA = "FAIXA 3"
                End If
                
                
            OrigemRecurso = "FGTS - FUNDO DE GARANTIA POR TEMPO DE SERVICO"
            Call SimuladorFGTS
            
            ElseIf OrigemRecurso = "SBPE" Then
            OrigemRecurso = "SBPE"
            Call SimuladorSBPE
            
            End If
        
        End If

        'MsgBox "PAROU"
        '
'Faz o loop para saber se tem mais algum para simular
ActiveCell.Offset(1, 0).Select
Loop


'SeÁ„o para desmarca os imoveis
Workbooks(NomeArquivo).Sheets("Resultados").Range("AG4") = 100

'Seleciona a celula para comeÁar o loop nos imoveis
Workbooks(NomeArquivo).Sheets("Simulador").Range("C9").Select

'Limpa os dados
Workbooks(NomeArquivo).Sheets("Resultados").Range("P11") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("P12") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("P13") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("AM11") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("AM12") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("AM13") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("AC15") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("AC16") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("V23") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("V25") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("V26") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("V27") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("V32") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("V33") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("V34") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("AG33") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("AS37") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("Q37") = ""
Workbooks(NomeArquivo).Sheets("Resultados").Range("AG33") = ""

Dim MsgFechaChrome As VbMsgBoxResult
MsgFechaChrome = MsgBox("Deseja fechar o Chrome?", vbYesNo, "Fechamento do Google Chrome")
'LIMPA OS IM”VES SELECIONADOS
Workbooks(NomeArquivo).Sheets("Simulador").Range("B9:B200").ClearContents

If MsgFechaChrome = vbYes Then
    Workbooks(NomeArquivo).Worksheets("Resultados").Select
    Call FecharChrome

Else

    Workbooks(NomeArquivo).Worksheets("Resultados").Select

    
End If

End Sub



'*****************************************************************************************************
'*****************************************************************************************************
'*****************************************************************************************************
'********                             ****************************************************************
'********      SIMUADLOR -- FGTS      ****************************************************************
'********                             ****************************************************************
'*****************************************************************************************************
'*****************************************************************************************************
'*****************************************************************************************************
Sub SimuladorFGTS()

Dim por As New By

        'Inicia Nova SimulaÁ„o
        driver.FindElementByXPath("//*[@id=""novaSimulacaoForm""]/a").Click
        fazer (5000)

'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar

Do While driver.IsElementPresent(por.XPath("//*[@id=""origemRecurso""]")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( ORIGEM DE RECURSOS )", vbInformation
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------


            '------------- PRIMEIRA SE«√O ORIGEM DE RECURSO -------------------------
            driver.FindElementByXPath("//*[@id=""origemRecurso""]").SendKeys OrigemRecurso
            driver.FindElementByXPath("//*[@id=""origemRecurso""]/option[2]").Click
            'driver.FindElementById("origemRecurso").SendKeys OrigemRecurso
            fazer (1000)
            'ESSE XPath È mesma coisa do ID Origem de Recurso
            'driver.FindElementByXPath("//*[@id=""origemRecurso""]/option[2]").Click
            
            driver.FindElementByXPath("//*[@id=""bottom_bar""]/fieldset/ul/li[2]/a").Click
            fazer (1000)
            
            '------------- FIM SE«√O ORIGEM DE RECURSO -------------------------
            
'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar

Do While driver.IsElementPresent(por.XPath("//*[@id=""categoriaImovel""]")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( DADOS IMOVEL E CLIENTE )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------

            
            '------------- SEGUNDA SE«√O DADOS IM”VEL E RENDA -------------------------
            
            'driver.FindElementById("categoriaImovel").SendKeys CategoriaImovel
            driver.FindElementByXPath("//*[@id=""categoriaImovel""]").SendKeys CategoriaImovel
            'driver.FindElementByXPath("//*[@id=""categoriaImovel""]/option[6]").Click
            fazer (1000)
            
            '--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar

Do While driver.IsElementPresent(por.XPath("//*[@id=""cidade""]")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( DADOS IMOVEL E CLIENTE )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------

            
            
            driver.FindElementByXPath("//*[@id=""cidade""]").Clear
            'driver.FindElementById("cidade").Clear
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""cidade""]").SendKeys Cidade
            'driver.FindElementById("cidade").SendKeys Cidade
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""valorImovel""]").SendKeys Avaliacao
            'driver.FindElementById("valorImovel").SendKeys ValorImovel
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""comprometimentoRenda""]").SendKeys PrestacaoSIRIC
            'driver.FindElementById("comprometimentoRenda").SendKeys PrestacaoSIRIC
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""renda""]").SendKeys RENDA
            'driver.FindElementById("renda").SendKeys Renda
            fazer (1000)
            If Tres_Anos = "SIM" Then
            driver.FindElementByXPath("//*[@id=""checkbox""]").Click
            'driver.FindElementById("checkbox").Click
            fazer (1000)
            End If
            driver.FindElementByXPath("//*[@id=""bottom_bar""]/fieldset/ul/li[2]/a").Click
            fazer (1000)
            '------------- FIM SE«√O DADOS IM”VEL E RENDA -------------------------

'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar

Do While driver.IsElementPresent(por.XPath("//*[@id=""bottom_bar""]/fieldset/ul/li[2]/a")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( CONDICIONAIS )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------

            
            '------------- TERCEIRA SE«√O CONDICIONAIS -------------------------
            
            driver.FindElementByXPath("//*[@id=""bottom_bar""]/fieldset/ul/li[2]/a").Click
            fazer (1000)
            
            '------------- FIM SE«√O CONDICIONAIS -------------------------
            
'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar

Do While driver.IsElementPresent(por.XPath("//*[@id=""dataNascimento""]")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( DATA NASCIMENTO )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------

            
            '------------- TERCEIRA SE«√O DATA NASCIMENTO -------------------------
            driver.FindElementByXPath("//*[@id=""dataNascimento""]").SendKeys DataNascimento
            'driver.FindElementById("dataNascimento").SendKeys DataNascimento
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""bottom_bar""]/fieldset/ul/li[2]/a").Click
            fazer (1000)
            '------------- FIM SE«√O DATA NASCIMENTO -------------------------

'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar
Do While driver.IsElementPresent(por.XPath("//*[@id=""modalidade""]")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( ENQUADRAMENTO )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------
            
            '------------- QUARTA SE«√O ENQUADRAMENTO -------------------------
            
            'driver.Refresh
            fazer (1000)
            
            If FAIXA = "FAIXA 2" Then
            
            'driver.FindElementByXPath("//*[@id=""modalidade""]/a[16]").Click
            'driver.FindElementByLinkText("").Click
            'driver.Get "https://www.portaldeempreendimentos.caixa.gov.br/simulador/listaenquadramentos.modalidade/3048"
            driver.Get "https://www.portaldeempreendimentos.caixa.gov.br/simulador/listaenquadramentos.modalidade/3280"
            
            ElseIf FAIXA = "FAIXA 3" Then
            
            'driver.Get "https://www.portaldeempreendimentos.caixa.gov.br/simulador/listaenquadramentos.modalidade/3050"
            driver.Get "https://www.portaldeempreendimentos.caixa.gov.br/simulador/listaenquadramentos.modalidade/3302"
            
            End If
            
            
            fazer (1000)
            
            '------------- FIM SE«√O ORIGEM DE RECURSO -------------------------
            
'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar
Do While driver.IsElementPresent(por.XPath("//*[@id=""rcrRge""]/option[2]")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( Tabela e Dependente )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------

            '------------- QUINTA SE«√O TABELA E DEPENDENTE -------------------------
            
            '¡REA UTIL DO APARTAMENTO
            driver.FindElementByXPath("//*[@id=""areaUtil""]").SendKeys AreaUtil
            fazer (1000)
            
            'VERIFICA A TABELA - PRICE / SAC
            If tabela = "SAC" Then
                'Tabela SAC
                driver.FindElementByXPath("//*[@id=""rcrRge""]/option[1]").Click
                TabelaResult = "SAC"
            ElseIf tabela = "PRICE" Then
                'TABELA PRICE
                driver.FindElementByXPath("//*[@id=""rcrRge""]/option[2]").Click
                TabelaResult = "PRICE"
            End If
            
            fazer (1000)
        If driver.IsElementPresent(por.XPath("//*[@id=""possuiMaisUmParticipante""]")) = True Then
            If Dependente = "SIM" Then
                If ContDepen = 0 Then
                    driver.FindElementByXPath("//*[@id=""possuiMaisUmParticipante""]").Click
                    ContDepen = 1
                End If
            fazer (1000)
            End If
        End If
            driver.FindElementByXPath("//*[@id=""bottom_bar""]/fieldset/ul/li[2]/a").Click
            fazer (2000)
            '------------- FIM SE«√O ORIGEM DE RECURSO -------------------------
            
'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar
Do While driver.IsElementPresent(por.XPath("//*[@id=""cronogramaForm""]/div[2]/fieldset/ul/li/a")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( Calcular Prazo Obra )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------

            '------------- SEXTA SE«√O PRAZO DE OBRA -------------------------
            
            
            
            If PrazoObra > 36 Then
                PrazoObra = "36"
                
            ElseIf PrazoObra < 1 Then
                PrazoObra = "5"
                
            Else
                PrazoObra = PrazoObra
                
            End If
            
            
            driver.FindElementById("prazoObra").SendKeys PrazoObra
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""cronogramaForm""]/div[2]/fieldset/ul/li/a").Click
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""bottom_bar""]/fieldset/ul/li[2]/a").Click
            fazer (2000)
            
            '------------- FIM SE«√O ORIGEM DE RECURSO -------------------------
            
'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar
Do While driver.IsElementPresent(por.XPath("//*[@id=""table_condicoes_especiais""]/tbody/tr[2]/th[4]/div/ul/li/a")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( resultados )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------

  '------------- SETIMA SE«√O RESULTADO -------------------------
            
            fazer (2000)
            ValorEntrada = driver.FindElementByXPath("//*[@id=""idTabelaResumo""]/tbody/tr[5]/td[2]").Text
            
        '*************************************************************
            '---------- remove o R$ para o Excel
            junk = Array("R", "$", " ", ".")
            
            For Each a In junk
            ValorEntrada = Replace(ValorEntrada, a, "")
            Next a
            '************************************************************
            
            
          Workbooks(NomeArquivo).Sheets("Resultados").Range("P31") = ValorEntrada
          ValorEntrada = Workbooks(NomeArquivo).Sheets("Resultados").Range("P31")
          fgts = Workbooks(NomeArquivo).Sheets("Simulador").Range("F3")
          fgts = Format(fgts, "##.,00")
          fgts = fgts
'************************************************************************************************
'********* VERIFICAR SE O FGTS … MAIOR QUE A ENTRADA ********************************************
'************************************************************************************************

        If fgts > ValorEntrada Then
            
            driver.Get "https://www.portaldeempreendimentos.caixa.gov.br/simulador/detalhamento.prazoentrada"

'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
Do While driver.IsElementPresent(por.XPath("//*[@id=""valorEntrada""]")) = False
If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( ALTERAR A ENTRADA )"
Exit Sub
End If
Cont = Cont + 1
Application.Wait Now + TimeValue("00:00:01")
Loop
'*****************************************************************************************************************************

            driver.FindElementByXPath("//*[@id=""valorEntrada""]").Clear
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""valorEntrada""]").SendKeys fgts
            'fazer (1000)
            'PrazoFinanciamento = driver.FindElementByXPath("//*[@id=""form""]/fieldset/p/text()[2]").Text
            'fazer (1000)
            'PrazoFinanciamento = driver.FindElementByXPath("//*[@id=""form""]/fieldset/p/text()[2]").Text
            'fazer (1000)
            'driver.FindElementByXPath("//*[@id=""prazo""]").Clear
            fazer (1000)
            'driver.FindElementByXPath("//*[@id=""prazo""]").SendKeys "360"
            'driver.FindElementByXPath("//*[@id=""prazo""]").SendKeys PrazoFinanciamento
            fazer (2000)
            driver.FindElementByXPath("//*[@id=""bottom_bar""]/fieldset/ul/li/a").Click
            
'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
Do While driver.IsElementPresent(por.XPath("//*[@id=""table_condicoes_especiais""]/tbody/tr[2]/th[4]/div/ul/li/a")) = False
If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( ALTERAR A ENTRADA )"
Exit Sub
End If
Cont = Cont + 1
Application.Wait Now + TimeValue("00:00:01")
Loop
'*****************************************************************************************************************************

            
        End If
'*****************************************************************************************************************************
'*****************************************************************************************************************************
            
            PrestaÁ„o = driver.FindElementByXPath("//*[@id=""detalhamento""]/tbody/tr[14]/td[2]").Text
            fazer (2000)
            driver.Get "https://www.portaldeempreendimentos.caixa.gov.br/simulador/detalhamento.planilhacet/999"
            'driver.FindElementByXPath("//*[@id=""table_condicoes_especiais""]/tbody/tr[2]/th[4]/div/ul/li/a").Click
            fazer (2000)
            On Error Resume Next
                                        '//*[@id="table_condicoes_especiais"]/tbody/tr[2]/th[4]/div/ul/li/a


            valorFinanciamento = driver.FindElementByXPath("//*[@id=""resumo_simulador""]/span[9]").Text
            subsidio = 0
            
            If Err.Number = 13 Then
            valorFinanciamento = driver.FindElementByXPath("//*[@id=""resumo_simulador""]/span[11]").Text
            subsidio = driver.FindElementByXPath("//*[@id=""resumo_simulador""]/span[8]").Text
            End If
            
            '//*[@id="resumo_simulador"]/span[9]
            
            
            '---------- remove o R$ para o Excel
            junk = Array("R", "$", " ")
            
            For Each a In junk
            subsidio = Replace(subsidio, a, "")
            PrestaÁ„o = Replace(PrestaÁ„o, a, "")
            valorFinanciamento = Replace(valorFinanciamento, a, "")
            Next a
            '************************************************************
            
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 69) = NumeroResultados
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 72) = NomeImovel
            'Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 36) = Cidade
            'Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 37) = Endereco
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 74) = valorImovel
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 75) = valorFinanciamento
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 76) = subsidio
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 77) = PrestaÁ„o
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 78) = Mensais
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 79) = DataEntrega
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 80) = Construtora
            
            
            Avaliacao = Workbooks(NomeArquivo).Sheets("Simulador").Cells(linha, 8)
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 81) = Avaliacao
            
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 82) = TabelaResult
            
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 71) = NomeClienteSimulacao
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 70) = NomeClienteSimulacao & " - " & NomeImovel
            
            NumeroResultados = NumeroResultados + 1
            LINHA2 = LINHA2 + 1


End Sub




'*****************************************************************************************************
'*****************************************************************************************************
'*****************************************************************************************************
'********                             ****************************************************************
'********      SIMUADLOR -- SBPE      ****************************************************************
'********                             ****************************************************************
'*****************************************************************************************************
'*****************************************************************************************************
'*****************************************************************************************************
Sub SimuladorSBPE()

Dim por As New By

        'Inicia Nova SimulaÁ„o
        driver.FindElementByXPath("//*[@id=""novaSimulacaoForm""]/a").Click
        fazer (5000)
        
'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar

Do While driver.IsElementPresent(por.ID("origemRecurso")) = False
'Do While driver.IsElementPresent(por.XPath("//*[@id=""origemRecurso""]")) = False
'//*[@id=""origemRecurso""]

'driver.IsElementPresent(por.ID("origemRecurso")) = False
If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( ORIGEM DE RECURSOS )", vbInformation
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------

            '------------- PRIMEIRA SE«√O ORIGEM DE RECURSO -------------------------
            driver.FindElementByXPath("//*[@id=""origemRecurso""]").SendKeys OrigemRecurso
            driver.FindElementByXPath("//*[@id=""origemRecurso""]/option[5]").Click
            'driver.FindElementById("origemRecurso").SendKeys OrigemRecurso
            fazer (1000)
            'ESSE XPath È mesma coisa do ID Origem de Recurso
            'driver.FindElementByXPath("//*[@id=""origemRecurso""]/option[2]").Click
            
            driver.FindElementByXPath("//*[@id=""bottom_bar""]/fieldset/ul/li[2]/a").Click
            '
            fazer (1000)
            
            '------------- FIM SE«√O ORIGEM DE RECURSO -------------------------
            
'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar

Do While driver.IsElementPresent(por.XPath("//*[@id=""categoriaImovel""]")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( DADOS IMOVEL E CLIENTE )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------

            
            '------------- SEGUNDA SE«√O DADOS IM”VEL E RENDA -------------------------
            
            'driver.FindElementById("categoriaImovel").SendKeys CategoriaImovel
            driver.FindElementByXPath("//*[@id=""categoriaImovel""]").SendKeys CategoriaImovel
            driver.FindElementByXPath("//*[@id=""categoriaImovel""]/option[6]").Click
            fazer (1000)
            
            '--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar

Do While driver.IsElementPresent(por.XPath("//*[@id=""cidade""]")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( DADOS IMOVEL E CLIENTE )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------

            
            
            driver.FindElementByXPath("//*[@id=""cidade""]").Clear
            'driver.FindElementById("cidade").Clear
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""cidade""]").SendKeys Cidade
            'driver.FindElementById("cidade").SendKeys Cidade
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""valorImovel""]").SendKeys Avaliacao
            'driver.FindElementById("valorImovel").SendKeys ValorImovel
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""comprometimentoRenda""]").SendKeys PrestacaoSIRIC
            'driver.FindElementById("comprometimentoRenda").SendKeys PrestacaoSIRIC
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""renda""]").SendKeys RENDA
            'driver.FindElementById("renda").SendKeys Renda
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""bottom_bar""]/fieldset/ul/li[2]/a").Click
            fazer (1000)
            '------------- FIM SE«√O DADOS IM”VEL E RENDA -------------------------

          
'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar

Do While driver.IsElementPresent(por.XPath("//*[@id=""dataNascimento""]")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( DATA NASCIMENTO )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------

            
            '------------- TERCEIRA SE«√O DATA NASCIMENTO -------------------------
            driver.FindElementByXPath("//*[@id=""dataNascimento""]").SendKeys DataNascimento
            'driver.FindElementById("dataNascimento").SendKeys DataNascimento
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""bottom_bar""]/fieldset/ul/li[2]/a").Click
            fazer (1000)
            '------------- FIM SE«√O DATA NASCIMENTO -------------------------

'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar
Do While driver.IsElementPresent(por.XPath("//*[@id=""modalidade""]")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( ENQUADRAMENTO )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------
            
            '------------- QUARTA SE«√O ENQUADRAMENTO -------------------------
            
            'driver.Refresh
            fazer (1000)
            
            'driver.Get "https://www.portaldeempreendimentos.caixa.gov.br/simulador/listaenquadramentos.modalidade/3074"
            driver.Get "https://www.portaldeempreendimentos.caixa.gov.br/simulador/listaenquadramentos.modalidade/1976"
            'listaenquadramentos.modalidade/1976
            
            
            fazer (1000)
            
            '------------- FIM SE«√O ORIGEM DE RECURSO -------------------------
            
'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar
Do While driver.IsElementPresent(por.XPath("//*[@id=""rcrRge""]/option[2]")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( Tabela e Dependente )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------
  
            '------------- QUINTA SE«√O TABELA E DEPENDENTE -------------------------

                        'VERIFICA A TABELA - PRICE / SAC
            If tabela = "SAC" Then
                'Tabela SAC
                driver.FindElementByXPath("//*[@id=""rcrRge""]/option[1]").Click
                TabelaResult = "SAC"
            ElseIf tabela = "PRICE" Then
                'TABELA PRICE
                driver.FindElementByXPath("//*[@id=""rcrRge""]/option[2]").Click
                TabelaResult = "PRICE"
            End If
            
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""bottom_bar""]/fieldset/ul/li[2]/a").Click
            fazer (2000)
            '------------- FIM SE«√O ORIGEM DE RECURSO -------------------------
            
'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar
Do While driver.IsElementPresent(por.XPath("//*[@id=""cronogramaForm""]/div[2]/fieldset/ul/li/a")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( Calcular Prazo Obra )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------
  

            '------------- SEXTA SE«√O PRAZO DE OBRA -------------------------
            
            
            
            If PrazoObra > 36 Then
                PrazoObra = "36"
                
            ElseIf PrazoObra < 1 Then
                PrazoObra = "5"
                
            Else
                PrazoObra = PrazoObra
                
            End If
            
            
            driver.FindElementById("prazoObra").SendKeys PrazoObra
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""cronogramaForm""]/div[2]/fieldset/ul/li/a").Click
            fazer (1000)
            driver.FindElementByXPath("//*[@id=""bottom_bar""]/fieldset/ul/li[2]/a").Click
            fazer (2000)
            
            '------------- FIM SE«√O ORIGEM DE RECURSO -------------------------
            
'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar
Do While driver.IsElementPresent(por.XPath("//*[@id=""table_condicoes_especiais""]/tbody/tr[2]/th[4]/div/ul/li/a")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( resultados )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------
  
            
            '------------- SETIMA SE«√O RESULTADO -------------------------
            
            fazer (2000)
            PrestaÁ„o = driver.FindElementByXPath("//*[@id=""detalhamento""]/tbody/tr[14]/td[2]").Text
            'driver.FindElementByXPath("//*[@id=""table_condicoes_especiais""]/tbody/tr[2]/th[4]/div/ul/li/a").Click
            '//*[@id="table_condicoes_especiais"]/tbody/tr[2]/th[4]/div/ul/li/a
            driver.Get "https://www.portaldeempreendimentos.caixa.gov.br/simulador/detalhamento.planilhacet/999"
            'fazer (2000)
            
            
            
'--------------------------------------------LOOP PARA ESPERAR N⁄MERO CARREGAR--------------------------------------------------------------------
'Loop para esperar o numero carregar
Do While driver.IsElementPresent(por.XPath("//*[@id=""resumo_simulador""]/span[9]")) = False

If Cont > 60 Then
MsgBox "Simulador travou. SeÁ„o ( resultados )"
Exit Sub
End If

Cont = Cont + 1
'espera por um segundo
'o uso do Application.Wait serve para n„o congelar a execuÁ„o do VBA
Application.Wait Now + TimeValue("00:00:01")

Loop
'-------------------------------------------------------------------------------------------------------------------------
  
            
            
            
            
            
            valorFinanciamento = driver.FindElementByXPath("//*[@id=""resumo_simulador""]/span[9]").Text
           
            
            '---------- remove o R$ para o Excel
            'Dim por As New By
            junk = Array("R", "$", " ")
            
            For Each a In junk
            PrestaÁ„o = Replace(PrestaÁ„o, a, "")
            valorFinanciamento = Replace(valorFinanciamento, a, "")
            Next a
            '************************************************************
            
            
            
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 69) = NumeroResultados
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 72) = NomeImovel
            'Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 36) = Cidade
            'Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 37) = Endereco
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 74) = valorImovel
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 75) = valorFinanciamento
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 76) = ""
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 77) = PrestaÁ„o
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 78) = Mensais
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 79) = DataEntrega
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 80) = Construtora
            
            
            Avaliacao = Workbooks(NomeArquivo).Sheets("Simulador").Cells(linha, 8)
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 81) = Avaliacao
            
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 82) = TabelaResult
            
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 71) = NomeClienteSimulacao
            
            Workbooks(NomeArquivo).Sheets("Resultados").Cells(LINHA2, 70) = NomeClienteSimulacao & " - " & NomeImovel

            
            NumeroResultados = NumeroResultados + 1
            LINHA2 = LINHA2 + 1
        
        
End Sub


Sub Copiar()
NomeArquivo = Application.ThisWorkbook.Name
Workbooks(NomeArquivo).Sheets("SimulaÁ„o").Activate
ActiveSheet.Range("a1:L47").Select
'Cells(17, 5).Select '--selecione a cÈlula que vocÍ deseja copiar
Selection.Copy '--cÛdigo para copiar a cÈlula selecionada
Workbooks(NomeArquivo).Sheets("New-Resultados").Activate
End Sub
Sub Copiar_atualizar()
NomeArquivo = Application.ThisWorkbook.Name

If Workbooks(NomeArquivo).Sheets("Resultados").Range("AM12") = "" Then
    MsgBox "CAMPO VAZIO ( UNIDADE DO EMPREENDIMENTO ) POR FAVOR PREENCHER", vbCritical, "CAMPO VAZIO"
    Exit Sub
End If
If Workbooks(NomeArquivo).Sheets("Resultados").Range("AM13") = "" Then
    MsgBox "CAMPO VAZIO ( POSI«√O DA UNIDADE ) POR FAVOR PREENCHER", vbCritical, "CAMPO VAZIO"
    Exit Sub
End If
If Workbooks(NomeArquivo).Sheets("Resultados").Range("AS37") = "" Then
    MsgBox "CAMPO VAZIO ( JUROS DE OBRA ) POR FAVOR PREENCHER", vbCritical, "CAMPO VAZIO"
    Exit Sub
End If
If Workbooks(NomeArquivo).Sheets("Resultados").Range("Q37") = "" Then
    MsgBox "CAMPO VAZIO ( TAXAS CART”RARIAS ) POR FAVOR PREENCHER", vbCritical, "CAMPO VAZIO"
    Exit Sub
End If

ActiveSheet.Range("D2:BA41").Select
'Cells(17, 5).Select '--selecione a cÈlula que vocÍ deseja copiar
Selection.Copy '--cÛdigo para copiar a cÈlula selecionada
Workbooks(NomeArquivo).Sheets("Resultados").Range("AG33").Select
End Sub



Public Sub Resultados_ATUALIZA«√O()

NomeArquivo = Application.ThisWorkbook.Name
Workbooks(NomeArquivo).Sheets("Resultados").Range("d5").Select
Dim intervalo As Range
Dim texto As String
Dim codigo As Integer
Dim pequisa As String
Dim mensagem


Dim total As Long
Dim Mensais As Long
Dim Avaliacao As Long

fgts = 0


Workbooks(NomeArquivo).Sheets("Resultados").Select
codigo = Workbooks(NomeArquivo).Sheets("Resultados").Range("AG4")

Set intervalo = Range("AH6:BX200")

On Error GoTo TrataErro

Pesq1 = Application.WorksheetFunction.VLookup(codigo, intervalo, 2, False)   'NOME EMPREENDIMENTO
Pesq2 = Application.WorksheetFunction.VLookup(codigo, intervalo, 5, False)   'VALOR IM”VEL
Pesq3 = Application.WorksheetFunction.VLookup(codigo, intervalo, 6, False)   'FINANCIAMENTO
Pesq4 = Application.WorksheetFunction.VLookup(codigo, intervalo, 7, False)   'SUBSIDIO
Pesq5 = Application.WorksheetFunction.VLookup(codigo, intervalo, 8, False)   'PRESTA«√O
Pesq6 = Application.WorksheetFunction.VLookup(codigo, intervalo, 9, False)   'PRAZO
Pesq7 = Application.WorksheetFunction.VLookup(codigo, intervalo, 10, False)  'ENTREGA
Pesq8 = Application.WorksheetFunction.VLookup(codigo, intervalo, 11, False)  'CONSTRUTORA
Pesq9 = Application.WorksheetFunction.VLookup(codigo, intervalo, 12, False)  'AVALIACAO
Pesq10 = Application.WorksheetFunction.VLookup(codigo, intervalo, 13, False) 'TABELA
Pesq11 = Application.WorksheetFunction.VLookup(codigo, intervalo, 14, False) 'NomeCliente
Pesq12 = Application.WorksheetFunction.VLookup(codigo, intervalo, 15, False) 'UNIDADE
Pesq13 = Application.WorksheetFunction.VLookup(codigo, intervalo, 16, False) 'POSI«√O
Pesq14 = Application.WorksheetFunction.VLookup(codigo, intervalo, 17, False) 'JUROS DE OBRA
Pesq15 = Application.WorksheetFunction.VLookup(codigo, intervalo, 18, False) 'TAXAS
Pesq16 = Application.WorksheetFunction.VLookup(codigo, intervalo, 19, False) 'ID LEAD
Pesq17 = Application.WorksheetFunction.VLookup(codigo, intervalo, 20, False) 'QD SINAIS
Pesq18 = Application.WorksheetFunction.VLookup(codigo, intervalo, 21, False) 'VALOR SINAL
Pesq19 = Application.WorksheetFunction.VLookup(codigo, intervalo, 22, False) 'DESCRI«√O 01
Pesq20 = Application.WorksheetFunction.VLookup(codigo, intervalo, 23, False) 'QD DES 01
Pesq21 = Application.WorksheetFunction.VLookup(codigo, intervalo, 24, False) 'VALOR DES 01
Pesq22 = Application.WorksheetFunction.VLookup(codigo, intervalo, 25, False) 'DESCRI«√O 02
Pesq23 = Application.WorksheetFunction.VLookup(codigo, intervalo, 26, False) 'QD DES 02
Pesq24 = Application.WorksheetFunction.VLookup(codigo, intervalo, 27, False) 'VALOR DES 02
Pesq25 = Application.WorksheetFunction.VLookup(codigo, intervalo, 28, False) 'DESCRI«√O 03
Pesq26 = Application.WorksheetFunction.VLookup(codigo, intervalo, 29, False) 'VALOR DES 03



Workbooks(NomeArquivo).Sheets("Resultados").Range("G9") = Pesq1   'NOME EMPREENDIMENTO
Workbooks(NomeArquivo).Sheets("Resultados").Range("M23") = Pesq2  'VALOR IM”VEL
Workbooks(NomeArquivo).Sheets("Resultados").Range("M21") = Pesq3  'FINANCIAMENTO
Workbooks(NomeArquivo).Sheets("Resultados").Range("M20") = Pesq4   'SUBSIDIO
Workbooks(NomeArquivo).Sheets("Resultados").Range("M25") = Pesq5   'PRESTA«√O
Workbooks(NomeArquivo).Sheets("Resultados").Range("M15") = Pesq6   'PRAZO
Workbooks(NomeArquivo).Sheets("Resultados").Range("G10") = Pesq7  'ENTREGA
Workbooks(NomeArquivo).Sheets("Resultados").Range("N8") = Pesq8   'CONSTRUTORA
Workbooks(NomeArquivo).Sheets("Resultados").Range("M22") = Pesq9  'AVALIACAO
Workbooks(NomeArquivo).Sheets("Resultados").Range("P25") = Pesq10 'TABELA
Workbooks(NomeArquivo).Sheets("Resultados").Range("G8") = Pesq11  'NOME DO CLIENTE
Workbooks(NomeArquivo).Sheets("Resultados").Range("M19") = Workbooks(NomeArquivo).Sheets("Simulador").Range("F3") 'FGTS
Workbooks(NomeArquivo).Sheets("Resultados").Range("N14") = Workbooks(NomeArquivo).Sheets("Simulador").Range("F4") 'ENTRADA
Workbooks(NomeArquivo).Sheets("Resultados").Range("M14") = 1 'QUANTIDADE DE SINAIS

Workbooks(NomeArquivo).Sheets("Resultados").Range("N9") = Pesq12 'UNIDADE
Workbooks(NomeArquivo).Sheets("Resultados").Range("N10") = Pesq13 'POSI«√O
Workbooks(NomeArquivo).Sheets("Resultados").Range("M27") = Pesq14 'JUROS DE OBRA
Workbooks(NomeArquivo).Sheets("Resultados").Range("M28") = Pesq15 'TAXAS
Workbooks(NomeArquivo).Sheets("Resultados").Range("AC27") = Pesq16 'ID CLIENTE

'Workbooks(NomeArquivo).Sheets("Resultados").Range("M14") = Pesq17 'QD SINAIS
'Workbooks(NomeArquivo).Sheets("Resultados").Range("N14") = Pesq18 'VALOR SINAL
'Workbooks(NomeArquivo).Sheets("Resultados").Range("D16") = Pesq19 'DESCRI«√O 01
'Workbooks(NomeArquivo).Sheets("Resultados").Range("M16") = Pesq20 'QD DES 01
'Workbooks(NomeArquivo).Sheets("Resultados").Range("N16") = Pesq21 'VALOR DES 01
'Workbooks(NomeArquivo).Sheets("Resultados").Range("D17") = Pesq22 'DESCRI«√O 02
'Workbooks(NomeArquivo).Sheets("Resultados").Range("M17") = Pesq23 'QD DES 02
'Workbooks(NomeArquivo).Sheets("Resultados").Range("N17") = Pesq24 'VALOR DES 02
'Workbooks(NomeArquivo).Sheets("Resultados").Range("D19") = Pesq25 'DESCRI«√O 03
'Workbooks(NomeArquivo).Sheets("Resultados").Range("M19") = Pesq26 'VALOR DES 03





Exit Sub

TrataErro:
   texto = "Valores n„o encontrador"
   mensagem = MsgBox(texto, vbOKOnly + vbInformation)


End Sub




Sub Mod04_Resultados()
    Dim NomeArquivo As String
    Dim valorprocurado As String
    Dim wsResultados As Worksheet
    Dim celula As Range

    NomeArquivo = ThisWorkbook.Name
    Set wsResultados = Workbooks(NomeArquivo).Sheets("RESULTADOS")

    valorprocurado = wsResultados.Range("BQ6").Value

    ' Busca o valor na coluna BQ entre BQ9 e BQ55
    For Each celula In wsResultados.Range("BQ9:BQ555")
        If celula.Value = valorprocurado Then
            wsResultados.Range("AC8").Value = wsResultados.Cells(celula.Row, 71).Value   ' Coluna BS = NOME CLIENTE
            wsResultados.Range("P11").Value = wsResultados.Cells(celula.Row, 72).Value   ' Coluna BT = EMPREENDIMENTO
            wsResultados.Range("P12").Value = wsResultados.Cells(celula.Row, 80).Value   ' Coluna CB = CONSTRUTORA
            wsResultados.Range("AM11").Value = wsResultados.Cells(celula.Row, 79).Value  ' Coluna BY = PRAZO ENTREGA
            wsResultados.Range("AC15").Value = wsResultados.Cells(celula.Row, 74).Value   ' Coluna BV = VALOR IMOVEL
            wsResultados.Range("AF35").Value = wsResultados.Cells(celula.Row, 81).Value  ' Coluna BW = AVALIA«√O
            wsResultados.Range("V33").Value = wsResultados.Cells(celula.Row, 76).Value   ' Coluna BX = SUBSÕDIO
            ' wsResultados.Range("V32").Value = wsResultados.Cells(celula.Row, 77).Value ' FGTS (comentado)
            wsResultados.Range("V34").Value = wsResultados.Cells(celula.Row, 75).Value   ' Coluna CC = VALOR FINANCIAMENTO
            wsResultados.Range("AG33").Value = wsResultados.Cells(celula.Row, 77).Value  ' Coluna BY = PRESTA«√O
            wsResultados.Range("AS34").Value = wsResultados.Cells(celula.Row, 82).Value  ' Coluna CE = TABELA
            wsResultados.Range("Q37").Value = "" 'ITBI
            wsResultados.Range("AS37").Value = "" 'JUROS OBRA
            wsResultados.Range("AC16").Value = "" 'DESCONTO
            
            Exit For
        End If
    Next celula
End Sub



Sub VoltarSimulador()

NomeArquivo = Application.ThisWorkbook.Name

Workbooks(NomeArquivo).Sheets("Simulador").Visible = True
Workbooks(NomeArquivo).Sheets("Resultados").Visible = True
Workbooks(NomeArquivo).Sheets("Simulador").Select
End Sub
Sub VoltarResultados()

NomeArquivo = Application.ThisWorkbook.Name
Workbooks(NomeArquivo).Sheets("Simulador").Visible = True
Workbooks(NomeArquivo).Sheets("Resultados").Visible = True
Workbooks(NomeArquivo).Sheets("Resultados").Select


End Sub


Sub CopiarSimulacaoWhatsApp()

    Dim mensagem As String
    Dim ws As Worksheet: Set ws = ThisWorkbook.Sheets("Resultados")
    Dim em As Worksheet: Set em = ThisWorkbook.Sheets("Emojis")
    
    NomeArquivo = Application.ThisWorkbook.Name

If Workbooks(NomeArquivo).Sheets("Resultados").Range("AM12") = "" Then
    MsgBox "CAMPO VAZIO ( UNIDADE DO EMPREENDIMENTO ) POR FAVOR PREENCHER", vbCritical, "CAMPO VAZIO"
    Exit Sub
End If
If Workbooks(NomeArquivo).Sheets("Resultados").Range("AM13") = "" Then
    MsgBox "CAMPO VAZIO ( POSI«√O DA UNIDADE ) POR FAVOR PREENCHER", vbCritical, "CAMPO VAZIO"
    Exit Sub
End If
If Workbooks(NomeArquivo).Sheets("Resultados").Range("AS37") = "" Then
    MsgBox "CAMPO VAZIO ( JUROS DE OBRA ) POR FAVOR PREENCHER", vbCritical, "CAMPO VAZIO"
    Exit Sub
End If
If Workbooks(NomeArquivo).Sheets("Resultados").Range("Q37") = "" Then
    MsgBox "CAMPO VAZIO ( TAXAS CART”RARIAS ) POR FAVOR PREENCHER", vbCritical, "CAMPO VAZIO"
    Exit Sub
End If
    

    ' Emojis
    Dim eCasa As String: eCasa = em.Range("A1").Value
    Dim eCalendario As String: eCalendario = em.Range("A2").Value
    Dim eLocal As String: eLocal = em.Range("A3").Value
    Dim eQuarto As String: eQuarto = em.Range("A4").Value
    Dim eDinheiro As String: eDinheiro = em.Range("A5").Value
    Dim eBanco As String: eBanco = em.Range("A6").Value
    Dim eEntrada As String: eEntrada = em.Range("A7").Value
    Dim eFluxo As String: eFluxo = em.Range("A8").Value
    Dim ePonto As String: ePonto = em.Range("A9").Value
    Dim eChave As String: eChave = em.Range("A10").Value
    Dim eGrafico As String: eGrafico = em.Range("A11").Value
    Dim eEscudo As String: eEscudo = em.Range("A12").Value

    ' Dados do imÛvel
    Dim Empreendimento As String: Empreendimento = ws.Range("P11").Value
    Dim unidade As String: unidade = ws.Range("AM12").Value
    Dim posicao As String: posicao = ws.Range("AM13").Value
    Dim tipologia As String: tipologia = ws.Range("P13").Value
    
    ' Previs„o entrega formatada (ex: agosto/2027)
    Dim previsaoEntregaRaw As Date: previsaoEntregaRaw = ws.Range("AM11").Value
    Dim previsaoEntrega As String: previsaoEntrega = Format(previsaoEntregaRaw, "mmmm/yyyy")
    
    ' Valores
    Dim valorImovel As String: valorImovel = Format(ws.Range("AC15").Value, "R$ #,##0.00")
    Dim valorImovelFinal As String: valorImovelFinal = Format(ws.Range("AC17").Value, "R$ #,##0.00")
    Dim Desconto As Double: Desconto = ws.Range("AC16").Value
    Dim DescontoImovel As String: DescontoImovel = Format(Desconto, "R$ #,##0.00")
    Dim valorFinanciamento As String: valorFinanciamento = Format(ws.Range("V34").Value, "R$ #,##0.00")
    Dim valorParcelaFinanciamento As String: valorParcelaFinanciamento = Format(ws.Range("AG33").Value, "R$ #,##0.00")
    Dim tabela As String: tabela = ws.Range("AS34").Value

    ' Entrada
    Dim entradaValor As Double
    entradaValor = ws.Range("BL22").Value
    Dim entradaTexto As String: entradaTexto = Format(entradaValor, "R$ #,##0.00")
    
    ' Parcelas
    Dim sinal As String: sinal = Format(ws.Range("V23").Value, "R$ #,##0.00")
    Dim vencSinal As String: vencSinal = ws.Range("AH23").Value
    
    ' MENSAL
    Dim qtdMensais As String: qtdMensais = ws.Range("S24").Value
    Dim valorMensal As String: valorMensal = Format(ws.Range("V24").Value, "R$ #,##0.00")
    Dim vencMensalRaw As Date: vencMensalRaw = ws.Range("AH24").Value
    Dim vencMensal As String: vencMensal = Format(vencMensalRaw, "mmmm/yyyy")
    
    ' ANUAL
    Dim descricaoAnuais As String: descricaoAnuais = ws.Range("G25").Value
    Dim qtdAnuais As String: qtdAnuais = ws.Range("S25").Value
    Dim valorAnualValor As Double: valorAnualValor = ws.Range("V25").Value
    Dim valorAnual As String: valorAnual = Format(valorAnualValor, "R$ #,##0.00")
    Dim vencAnualRaw As Date: vencAnualRaw = ws.Range("AH25").Value
    Dim vencAnual As String: vencAnual = Format(vencAnualRaw, "mmmm/yyyy")
    
    ' INTERMEDI¡RIA
    Dim descricaoIntermediaria As String: descricaoIntermediaria = ws.Range("g26").Value
    Dim qtdIntermediaria As String: qtdIntermediaria = ws.Range("S26").Value
    Dim valorIntermediariaValor As Double: valorIntermediariaValor = ws.Range("V26").Value
    Dim valorIntermediaria As String: valorIntermediaria = Format(valorIntermediariaValor, "R$ #,##0.00")
    Dim vencIntermediariaRaw As Date: vencIntermediariaRaw = ws.Range("AH26").Value
    Dim vencIntermediaria As String: vencIntermediaria = Format(vencIntermediariaRaw, "mmmm/yyyy")


    ' SubsÌdio e FGTS
    Dim subsidioValor As Double: subsidioValor = ws.Range("V33").Value
    Dim subsidio As String: subsidio = Format(subsidioValor, "R$ #,##0.00")
    
    Dim saldoFgtsValor As Double: saldoFgtsValor = ws.Range("V32").Value
    Dim saldoFgts As String: saldoFgts = Format(saldoFgtsValor, "R$ #,##0.00")

     ' Corretor
    'Dim corretor As String: corretor = "Victor Cristiano | Corretor de ImÛveis - CRECI 5018PF"
    Dim corretor As String: corretor = ws.Range("BC2").Value

    ' Monta mensagem
    mensagem = eEscudo & " *" & Empreendimento & "*" & vbCrLf & _
               eCasa & " *UNIDADE: " & unidade & "*" & vbCrLf & vbCrLf & _
               eCalendario & " _Previs„o de Entrega: " & previsaoEntrega & "_" & vbCrLf & _
               eLocal & " _PosiÁ„o: " & posicao & "_" & vbCrLf & _
               eQuarto & " _Tipologia: " & tipologia & "_" & vbCrLf & _
               "_______________________________________" & vbCrLf & _
               eDinheiro & " *Valor do imÛvel: " & valorImovel & "*" & vbCrLf

    
    ' Desconto
    If DescontoImovel > 0 Then
        mensagem = mensagem & ePonto & " _Desconto: " & DescontoImovel & "_" & vbCrLf
        mensagem = mensagem & eDinheiro & " _*Valor Final ImÛvel: " & valorImovelFinal & "*_" & vbCrLf
    End If
    
    
    mensagem = mensagem & eBanco & " _Financiamento: " & valorFinanciamento & "_" & vbCrLf
    
    ' SubsÌdio
    If subsidioValor > 0 Then
        mensagem = mensagem & ePonto & " _SubsÌdio: " & subsidio & "_" & vbCrLf
    End If
    
    ' FGTS
    If saldoFgtsValor > 0 Then
        mensagem = mensagem & ePonto & " _Saldo FGTS: " & saldoFgts & "_" & vbCrLf
    End If

    mensagem = mensagem & eEntrada & " _*Entrada Total: " & entradaTexto & "*_" & vbCrLf & _
               "_______________________________________" & vbCrLf & _
               eFluxo & " *Parcelamento da Entrada:*" & vbCrLf & _
               ePonto & " Sinal: " & sinal & " (" & vencSinal & ")" & vbCrLf & _
               ePonto & " Mensais: " & qtdMensais & "x de " & valorMensal & " (a partir de " & vencMensal & ")" & vbCrLf

    If valorAnualValor > 0 Then
        mensagem = mensagem & ePonto & " " & descricaoAnuais & ": " & qtdAnuais & "x de " & valorAnual & " (" & vencAnual & ")" & vbCrLf
    End If

    If valorIntermediariaValor > 0 Then
        mensagem = mensagem & ePonto & " " & descricaoIntermediaria & ": " & qtdIntermediaria & "x de " & valorIntermediaria & " (" & vencIntermediaria & ")" & vbCrLf
    End If

    mensagem = mensagem & "_______________________________________" & vbCrLf & _
               eChave & " *Parcela do financiamento: " & valorParcelaFinanciamento & "*" & vbCrLf & _
               eLocal & "_*SÛ comeÁa a pagar apÛs entrega do imÛvel*_" & vbCrLf & _
               eGrafico & " Tabela: " & tabela & vbCrLf & vbCrLf & _
               eEscudo & " _SimulaÁ„o feita por: " & corretor & "_"

    ' Copia para a ·rea de transferÍncia
    Dim DataObj As New MSForms.DataObject
    DataObj.SetText mensagem
    DataObj.PutInClipboard

    MsgBox "Mensagem copiada para o WhatsApp com sucesso!", vbInformation
End Sub

    

Function fazer(ByVal Acao As Double)

Application.Wait (Now() + Acao / 24 / 60 / 60 / 1000)

'milliSeconds
End Function

