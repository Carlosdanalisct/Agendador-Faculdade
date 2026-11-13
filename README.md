# Portal do Aluno + Agendamento Acadêmico (protótipo)

Protótipo de um módulo de **agendamento de atendimentos com a coordenação do curso**, integrado a uma simulação do Portal do Aluno.

**Site publicado:** https://carlosdanalisct.github.io/Agendador-Faculdade/
**Acesso da coordenação:** https://carlosdanalisct.github.io/Agendador-Faculdade/#gestao

> **Aviso:** é um protótipo de demonstração. Os dados de exemplo são fictícios, o login não é real e os textos legais **precisam de revisão jurídica** antes de qualquer uso real. Os nomes dos coordenadores só podem aparecer com autorização deles.

## O problema e a solução

Numa entrevista com a coordenação de um dos cursos, ouvimos que:
- cerca de **70% dos atendimentos são ajuste de grade** feito errado pelo aluno;
- a maioria se resolve em **~15 minutos**, mas todo atendimento ocupava um horário longo;
- muitos alunos procuram a coordenação para assuntos que **não são dela** (boletos, valores, documentos). Por LGPD, a coordenação nem tem acesso a dados financeiros.

O sistema ataca isso com:
1. **Triagem antes de agendar:** o aluno escolhe o assunto. Ajuste de grade e reprovação mostram uma orientação que muitas vezes resolve sem agendar; financeiro e documentos são encaminhados ao setor certo.
2. **Horários do tamanho do assunto:** 15 minutos, ou 45 para análise curricular.
3. **Chatbot de orientação por setor**, ligado ao agendamento.
4. **E-mails de verdade pelo Gmail** (sem custo): confirmação ao aluno, lembrete às 7h do dia do atendimento e resumo do dia ao coordenador.
5. **Visão da coordenação:** dashboard com indicadores da triagem, agendamentos, relatórios.

## O que já funciona

| Área | Funcionalidades |
|---|---|
| Portal (aluno) | Login demonstrativo (nome, qualquer CPF com 11 números, senha), página inicial no estilo do portal, card "Agendar atendimento" |
| Agendamento (aluno) | Triagem por assunto, orientação na hora, encaminhamento a outro setor, lista de coordenadores, agenda mensal, horários de 15/45 min, formulário com aviso de setor errado, confirmação, arquivo `.ics`, alteração e cancelamento, histórico e protocolos, chatbot |
| Coordenação | Login pela aba "Sou coordenador", dashboard (indicadores da triagem, motivos mais frequentes), confirmar/concluir/cancelar atendimentos, relatórios com filtros, telas de configuração (demonstrativas) |
| E-mails | Confirmação, alteração, cancelamento e confirmação pelo coordenador; lembrete diário às 7h; resumo do dia ao coordenador (Google Apps Script + Gmail) |
| Qualidade | Visual igual ao portal, celular e computador, modo escuro, contraste AA (4,5:1) verificado, navegação por teclado |

## Próximos trabalhos (equipes)

| Tema | Guia |
|---|---|
| **Banco de dados compartilhado** (agendamentos visíveis em qualquer aparelho) | [`docs/BANCO-DE-DADOS.md`](docs/BANCO-DE-DADOS.md) |
| **Chat com IA** (entender frases livres sem inventar regras) | [`docs/CHAT-IA.md`](docs/CHAT-IA.md) |

Antes de começar, leia [`docs/CONTRIBUINDO.md`](docs/CONTRIBUINDO.md).

## Estrutura

```
Agendador-Faculdade/
├── index.html              Portal do Aluno (precisa ficar na raiz)
├── style.css               Estilos do portal
├── app.js                  Portal em React (login aluno/coordenação e página inicial)
├── agendamento/
│   ├── index.html          Página do agendamento (carrega config.js e script.js)
│   ├── config.js           Liga o envio de e-mails (URL do Apps Script e senha)
│   ├── script.js           Telas, triagem, chatbot, gestão, dados de exemplo
│   └── style.css           Estilos do agendamento (mesma identidade do portal)
├── integracoes/gmail/
│   ├── Code.gs             Google Apps Script: planilha + Gmail + lembrete diário
│   └── LEIA-ME.md          Instalação passo a passo
├── docs/                   Documentação (tabela abaixo)
├── .gitignore
└── README.md
```

Sem etapa de build: são arquivos estáticos. O React vem por CDN (cdnjs).

## Como rodar

- **Online:** já publicado no GitHub Pages (branch `main`, pasta raiz). Cada merge na `main` atualiza o site em 1 a 3 minutos.
- **No computador:** abra a pasta no VS Code e use a extensão **Live Server** no `index.html`.
- Detalhes e problemas comuns: [`docs/COMO-RODAR.md`](docs/COMO-RODAR.md).

## Como usar (roteiro rápido)

1. **Aluno:** no portal, informe nome, qualquer CPF com 11 números e senha com 6+ caracteres. Clique em **Agendar atendimento**.
2. Escolha o **assunto**. Teste "Ajuste de grade" (orientação e "Isso resolveu?"), "Boleto" (encaminhamento) e "Análise curricular" (horário de 45 min).
3. Escolha coordenador, dia e horário, preencha o motivo e o **e-mail** (precisa estar na lista `PERMITIDOS` do Apps Script) e confirme. A confirmação chega no Gmail.
4. **Coordenação:** em `#gestao`, escolha **Sou coordenador**, qualquer e-mail válido e senha com 6+ caracteres. Confirme o atendimento (o aluno recebe e-mail). No Dashboard, **"Enviar os lembretes de hoje agora"** dispara o lembrete do dia e o resumo do coordenador.
5. **Reiniciar demonstração** (rodapé) volta aos dados de exemplo.

## Documentação

| Arquivo | Conteúdo |
|---|---|
| [`docs/COMO-RODAR.md`](docs/COMO-RODAR.md) | Rodar local, publicar, ligar os e-mails, problemas comuns |
| [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) | Como o código está organizado: telas, estado, dados, estilos, e-mails |
| [`docs/BANCO-DE-DADOS.md`](docs/BANCO-DE-DADOS.md) | Guia para a equipe do banco de dados |
| [`docs/CHAT-IA.md`](docs/CHAT-IA.md) | Guia para a equipe do chat com IA |
| [`docs/CHATBOT.md`](docs/CHATBOT.md) | Chatbot atual (palavras-chave) e base da triagem (entrevista) |
| [`docs/PERSONALIZAR.md`](docs/PERSONALIZAR.md) | Coordenadores, cursos, assuntos, horários, cores, rodapé |
| [`docs/CONFORMIDADE.md`](docs/CONFORMIDADE.md) | As 17 diretrizes legais e de acessibilidade, e o que falta |
| [`docs/CONTRIBUINDO.md`](docs/CONTRIBUINDO.md) | Fluxo de trabalho, convenções e checklist de testes |
| [`docs/HISTORICO.md`](docs/HISTORICO.md) | O que foi feito em cada etapa (pull requests) |
| [`integracoes/gmail/LEIA-ME.md`](integracoes/gmail/LEIA-ME.md) | Instalar e manter o envio de e-mails |

## Tecnologias

HTML5 · CSS3 (variáveis, modo escuro) · JavaScript puro · React 18 (UMD, CDN) · Google Apps Script (Gmail + Planilhas) · GitHub Pages

## Limitações conhecidas

- **Dados por navegador:** agendamentos e protocolos ficam no `localStorage` de cada navegador. Aluno e coordenador só se "enxergam" no mesmo navegador. Resolver isso é o trabalho do banco de dados.
- **Login demonstrativo:** não há autenticação real; a visão de coordenador é sempre a do coordenador de exemplo (id 1).
- **Chatbot por palavras-chave:** frases fora do vocabulário caem em "não consegui identificar".
- **E-mails:** só para endereços da lista `PERMITIDOS`; limite de 100 por dia (conta gratuita). A URL e a senha do serviço ficam públicas no `config.js`.
- Salas, blocos, dias de atendimento e dados do rodapé são exemplos. Logos e imagens oficiais não estão incluídos.

## Licença

Defina a licença antes de reutilizar o código fora da equipe (por exemplo MIT, ou uso restrito à instituição).
