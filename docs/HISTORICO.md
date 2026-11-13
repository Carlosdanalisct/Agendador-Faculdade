# Histórico

O que foi feito em cada etapa. Os detalhes de cada mudança estão nos pull requests do repositório.

| # | Etapa | Principais mudanças |
|---|---|---|
| — | Envio inicial | Portal do Aluno (React) e Agendamento (JavaScript puro) enviados pelo site do GitHub. O envio achatou as pastas, e o botão de agendamento dava 404 |
| 1 | Reorganização e correções | Pastas `agendamento/` e `docs/` restauradas; `.gitignore`; correção de alteração abandonada que sobrescrevia agendamento novo, de coordenador novo que travava a busca e de texto digitado sem escape; calendário a partir da data atual; dados salvos no navegador e "Reiniciar demonstração"; arquivo `.ics`; relatórios com números realistas; aviso de cookies que lembra a escolha |
| 2 | Agendamento pelo celular | Card "Agendar atendimento" no portal, porque no celular o menu lateral some |
| 3 | Contraste no modo escuro | Menu ativo e links legíveis; ajustes para contraste AA (4,5:1) |
| 4 | Login da coordenação no portal | Abas "Sou aluno" / "Sou coordenador"; a gestão abre direto e se mantém ao recarregar |
| 5 | Identidade visual do portal | Agendamento com a mesma barra, menu, trilha e componentes do portal; CSS reescrito em blocos; no celular, o submenu vira abas |
| 6 | Triagem baseada na entrevista | "Qual é o assunto?", orientação na hora com "Isso resolveu?", encaminhamento ao Financeiro e à Secretaria (com a explicação da LGPD), horários de 15/45 min, motivos só da coordenação, aviso de setor errado no formulário, chatbot com vocabulário dos alunos, indicadores da triagem no dashboard |
| 7 | (não juntado) | Simulação de caixa de e-mails e de "Agenda no Outlook". Substituída pelos e-mails reais (8) |
| 8 | E-mails reais pelo Gmail | Google Apps Script + planilha: confirmação, alteração, cancelamento, confirmação pelo coordenador, lembrete diário às 7h, resumo do dia ao coordenador; lista `PERMITIDOS`; `config.js`; título "Agendamento realizado" |
| 9 | CPF na demonstração | Login aceita qualquer CPF com 11 números |
| 10 | Documentação para as próximas equipes | Guias de banco de dados e de chat com IA, contribuição, histórico; documentação geral atualizada |

## Decisões que valem lembrar
- **Simulação, sem custo e sem contas institucionais:** nada usa e-mail ou agenda da faculdade ou de professores; os e-mails saem de um Gmail da equipe.
- **Triagem antes de agendar:** desenhada a partir de uma entrevista com a coordenação (~70% dos atendimentos são ajuste de grade; a maioria se resolve em ~15 minutos; financeiro e documentos não são da coordenação). Só as conclusões estão no repositório (veja [`CHATBOT.md`](CHATBOT.md)), não a transcrição.
- **IA, se entrar, só classifica:** as respostas continuam vindo de textos revisados (veja [`CHAT-IA.md`](CHAT-IA.md)).
- **Banco de dados:** a recomendação para a competição é usar a planilha Google que já existe (veja [`BANCO-DE-DADOS.md`](BANCO-DE-DADOS.md)).
