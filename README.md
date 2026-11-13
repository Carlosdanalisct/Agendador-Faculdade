# Portal do Aluno + Agendamento Acadêmico (protótipo)

Protótipo de dois sites que se conectam:

1. **Portal do Aluno** (raiz): tela de login, página inicial e menu. Feito com **React**.
2. **Agendamento Acadêmico** (`agendamento/`): o aluno escolhe o coordenador do curso, marca horário, acompanha protocolos e fala com um chatbot que indica o setor certo. Há também uma área de gestão para coordenadores e administradores. Feito com **JavaScript puro**.

> **Aviso:** todos os dados são **fictícios** e ficam só na memória do navegador. Não há servidor nem banco de dados. Os textos legais são de demonstração e **precisam de revisão jurídica** antes de qualquer uso real.

## Estrutura

```
portal-aluno-agendamento/
├── index.html            Página do Portal do Aluno (precisa ficar na raiz)
├── style.css             Estilos do portal (mobile first, modo escuro)
├── app.js                Lógica em React: login e portal
├── agendamento/
│   ├── index.html        Página do agendamento
│   ├── style.css         Estilos do agendamento
│   ├── config.js         Liga o envio de e-mails pelo Gmail (opcional)
│   └── script.js         Lógica: telas, chatbot, gestão, dados de exemplo
├── integracoes/gmail/    E-mails de confirmação e lembrete pelo Gmail (Google Apps Script)
├── docs/                 Documentação (veja abaixo)
├── .gitignore
└── README.md
```

## Como rodar

- **Rápido:** abra a pasta no VS Code, instale a extensão **Live Server** e clique em *Open with Live Server* no `index.html`.
- **Online:** publique no **GitHub Pages** (Settings → Pages → branch `main`, pasta `/ (root)`).
- Detalhes em [`docs/COMO-RODAR.md`](docs/COMO-RODAR.md).

O React é carregado por CDN (cdnjs), então é preciso internet para o portal abrir.

## Fluxo de uso

1. No portal, informe **nome**, **CPF** (válido) e **senha** (6+ caracteres). O nome vira a saudação "Olá, *nome*".
2. Clique em **Agendamento** no menu lateral.
3. Em **Agendar atendimento**, escolha o assunto. Ajuste de grade e reprovação mostram uma orientação que muitas vezes resolve sem agendar; assuntos financeiros e de documentos são encaminhados ao setor certo. Se for com a coordenação, escolha o coordenador, o dia e um horário do tamanho do assunto (15 ou 45 minutos).
4. Acompanhe em **Histórico e protocolos**. Dúvidas sobre o setor correto: **Chatbot**. Se o envio de e-mails estiver ligado (veja [`integracoes/gmail/LEIA-ME.md`](integracoes/gmail/LEIA-ME.md)), o aluno recebe a confirmação no Gmail e um lembrete às 7h do dia do atendimento; o coordenador recebe o resumo dos atendimentos do dia.
5. Coordenação (demonstração): na tela de login do portal, escolha **Sou coordenador**, informe qualquer e-mail válido e senha com 6+ caracteres e o perfil (Coordenador ou Administrador). Você vai direto para a gestão. Atalho: `index.html#gestao`.

## Documentação

| Arquivo | Conteúdo |
|---|---|
| [`docs/COMO-RODAR.md`](docs/COMO-RODAR.md) | Rodar local, publicar no GitHub Pages, problemas comuns |
| [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) | O que cada arquivo faz e como as telas se conectam |
| [`docs/PERSONALIZAR.md`](docs/PERSONALIZAR.md) | Trocar coordenadores, cursos, salas e dias de atendimento |
| [`docs/CHATBOT.md`](docs/CHATBOT.md) | Regras de orientação por setor e como incluir palavras |
| [`docs/CONFORMIDADE.md`](docs/CONFORMIDADE.md) | As 17 diretrizes legais e de acessibilidade, e o que falta |

## Tecnologias

HTML5 · CSS3 (mobile first, variáveis, modo escuro) · JavaScript · React 18 (UMD, CDN)

## Limitações conhecidas

- Sem autenticação real: o login é só de demonstração.
- Os agendamentos ficam salvos só neste navegador (localStorage). Use **Reiniciar demonstração** no rodapé para voltar aos dados de exemplo.
- Salas, blocos e dias de atendimento dos coordenadores são exemplos.
- Logos e imagens oficiais da instituição **não** estão incluídos (direitos autorais).

## Licença

Defina a licença antes de tornar o repositório público (por exemplo MIT, ou uso restrito à instituição).
