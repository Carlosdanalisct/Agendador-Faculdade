# Arquitetura

Site estático, sem build e sem servidor próprio. Duas páginas ligadas por links relativos, e um serviço externo opcional (Google Apps Script) para os e-mails.

```
                 ┌───────────────────────────────┐
 index.html ───> │ Portal do Aluno (app.js/React)│  login aluno / coordenação
                 └──────────────┬────────────────┘
        "Agendar atendimento"   │   "Entrar na gestão"
   agendamento/index.html       │   agendamento/index.html?gestao=coord|adm
                 ┌──────────────▼────────────────┐
                 │ Agendamento (script.js)       │  telas do aluno e da gestão
                 │ dados: localStorage           │
                 └──────────────┬────────────────┘
                                │ fetch POST (se config.js tiver EMAIL_API)
                 ┌──────────────▼────────────────┐
                 │ Google Apps Script (Code.gs)  │  planilha + Gmail + gatilho 7h
                 └───────────────────────────────┘
```

## Arquivos

| Arquivo | Papel |
|---|---|
| `index.html`, `style.css`, `app.js` | Portal do Aluno em React 18 via CDN (sem JSX: usa `React.createElement`, apelidado de `h`) |
| `agendamento/index.html` | Carrega `style.css`, `config.js` e `script.js`; contém o aviso de cookies `#ck` |
| `agendamento/config.js` | `window.CFG = { EMAIL_API, EMAIL_TOKEN }`. Vazio = sem e-mails |
| `agendamento/script.js` | Todo o módulo de agendamento (≈190 linhas densas) |
| `agendamento/style.css` | Estilos, em 13 blocos numerados |
| `integracoes/gmail/Code.gs` | Serviço de e-mails (roda na conta Google da equipe) |

## Portal do Aluno (`app.js`)

| Componente | Função |
|---|---|
| `App` | Mostra `Login` ou `Portal` conforme `localStorage['pda_nome']`. Com `#gestao` na URL, sempre mostra o login na aba da coordenação |
| `Login` | Abas **Sou aluno** (nome, CPF com 11 números, senha 6+) e **Sou coordenador** (e-mail, perfil, senha 6+). Aluno: salva só o nome. Coordenador: vai para `agendamento/index.html?gestao=coord` ou `?gestao=adm` |
| `Portal` | Página inicial: saudação, acesso rápido (o primeiro card é **Agendar atendimento**), tarefas, banner |
| `Topbar`, `Sidebar`, `Quick`, `Task`, `Banner` | Partes visuais. No celular o menu lateral some; o card de agendamento é o caminho |
| `maskCpf`, `validCpf` | Máscara do CPF. `validCpf` (dígitos verificadores) existe, mas a demonstração aceita qualquer CPF com 11 números |

## Agendamento (`agendamento/script.js`)

### Como funciona
- **Estado único** `S` (objeto global). **Navegação** por `go(página, parâmetro)`: atualiza `S.pg`/`S.x`, chama `salva()` e redesenha.
- **Renderização** por `R()`: monta cabeçalho, menu lateral, abas de celular, trilha ("Início › Agendamento › …") e o corpo, que vem de `Sx(p)` (aluno) ou `G(p)` (gestão). Tudo é texto HTML inserido com `innerHTML`.
- **Eventos** ficam em atributos `onclick="..."` que chamam funções globais.
- **Texto digitado pelo usuário** precisa passar por `E()` (escape de HTML) antes de entrar no HTML.

### Mapa do arquivo (em ordem)
| Trecho | Conteúdo |
|---|---|
| Utilitários | `$` (querySelector), `T` (hoje 00:00), `F` (data pt-BR), `iso`, `DR` (data relativa a hoje), `E` (escape), `MES` |
| Dados de base | `CO0`/`CO` (coordenadores), `CRS` (cursos), `NOME`/`ME` (aluno logado), `CATS` e `AS` (assuntos), `A` (agendamentos), `P` (protocolos), `NT` (avisos), `N` (contador de protocolo) |
| E-mails | `CFG`, `MAIL_ON`, `TXT`, `EMS`, `envia()` |
| Persistência | `SV` (chave), `TRI` (contadores da triagem), `salva()`, carregamento inicial, `rst()` (reiniciar) |
| Estado e horários | `S`, leitura de `?gestao=`, `MIN`/`HM`, `ocu15` (ocupação fictícia), `occ()` (conflito), `SLOTS(duração)` |
| Interface | `tt` (aviso), `ck` (cookies), `mo`/`cm` (janela), `go`, `stT` (status), ícones `IC`/`I`, menus `STU`/`GES`/`ADM`, `TIT`/`PAI` (trilha), `foot` (rodapé), `R()` |
| Telas do aluno | `Sx(p)` |
| Ações do aluno | `sv` (salvar agendamento), `ics` (arquivo de calendário), `cx` (cancelar), `ns` (nova solicitação) |
| Chatbot e triagem | `SUBK`, `SET`, `HIT`, `FQ`, `esc_` (escolha do assunto), `av_` (aviso no formulário), `NM`, `DS`, `ask`, `cs` |
| Gestão | `RD` (dados de relatório fictícios), `bars`, `G(p)`, `dt_`/`up` (detalhes e status), `ac_` (novo coordenador) |

### Telas
**Aluno** (`Sx`, menu `STU`):

| Chave | Tela |
|---|---|
| `home` | Início: saudação, próximo atendimento, acesso rápido, listas |
| `tri` | **Qual é o assunto?** (triagem) |
| `faq` | Orientação na hora + "Isso resolveu?" (ajuste de grade, reprovação) |
| `enc` | Encaminhamento ao Financeiro ou à Secretaria |
| `busca` → `perfil` → `agenda` → `form` → `conf` | Coordenador, dia e horário, dados, confirmação |
| `hist`, `det`, `prot`, `pd`, `nova` | Histórico, detalhe do agendamento, protocolos, nova solicitação |
| `notif`, `chat` | Avisos, chatbot |
| `priv`, `termos`, `reemb`, `conf17` | Páginas legais e de conformidade |

**Gestão** (`G`, menus `GES` coordenador / `ADM` administrador): `dash`, `ag`, `min`, `salas`, `prot`, `rel`, `perf`, `coord`, `cur`, `perm`, `cfg`. A gestão entra por `?gestao=coord|adm`; *Sair* volta a `../index.html#gestao`.

### Fluxo do agendamento
1. `tri`: `esc_(chave)` grava `S.as`. Financeiro/documentos → `enc` (soma `TRI.enc`). Ajuste de grade/reprovação → `faq` ("Sim, resolvi" soma `TRI.res`). Os demais → `busca`.
2. `agenda`: duração `DUR()` (do assunto, ou do agendamento sendo alterado); horários `SLOTS(duração)` entre 09h–12h e 14h–17h; `occ()` bloqueia sobreposição com outros agendamentos e com a ocupação fictícia.
3. `form` → `sv()`: valida, cria (ou altera, se `S.re`) o agendamento em `A`, chama `envia()` e vai para `conf`.

### Estado `S` (principais campos)
| Campo | Significado |
|---|---|
| `env`, `adm` | `'aluno'` ou `'ges'`; administrador sim/não |
| `pg`, `x` | Tela atual e seu parâmetro (id do coordenador, protocolo…) |
| `as` | Assunto escolhido na triagem (chave de `AS`) |
| `bk` | Agendamento em montagem: `{co, dt, h}` |
| `re`, `re2` | Protocolo em alteração; se a última confirmação foi alteração |
| `cm` | Mês exibido na agenda (0 = atual, 1 = próximo) |
| `q`, `cu`, `pq`, `st`, `f` | Filtros: busca, curso, protocolo, situação, relatório |
| `ch` | Histórico da conversa do chatbot |

## Dados

Formato dos registros (detalhes e proposta de banco em [`BANCO-DE-DADOS.md`](BANCO-DE-DADOS.md)):

| Coleção | Campos |
|---|---|
| `CO` (coordenadores) | `id`, `n` nome, `r` cargo, `cs` cursos (lista), `c` cursos (texto), `d` dias da semana (0–6), `s` sala, `l` local |
| `A` (agendamentos) | `p` protocolo, `a` aluno, `ra`, `co` id do coordenador, `c` cursos, `dt` data `AAAA-MM-DD`, `h` hora `HH:MM`, `dur` minutos, `s` sala, `m` assunto (de `CATS`), `st` status, `o` observações, `em` e-mail (opcional) |
| `P` (solicitações) | `p` protocolo, `as` assunto, `dt` data `DD/MM/AAAA`, `st` status, `tl` andamento (lista de textos) |
| `TRI` | `res` resolvidos sem agendamento, `enc` encaminhados |

Status de agendamento: `Pendente` → `Confirmado` → `Concluído`, ou `Cancelado`.

### Onde ficam salvos
| Chave do `localStorage` | Conteúdo | Quem grava |
|---|---|---|
| `pda_nome` | Nome do aluno (login) | `app.js` |
| `pda_demo2` | `{me, A, P, N, CO, TRI}` | `salva()`, a cada `go()` |
| `pda_email` | Último e-mail informado no formulário | `sv()` |
| `pda_ck` | Escolha do aviso de cookies | `ck()` |

`rst()` (link "Reiniciar demonstração") apaga `pda_demo2` e recarrega.

## E-mails (opcional)
Com `CFG.EMAIL_API` preenchido, `envia(acao, agendamento)` faz `POST` (corpo JSON em `text/plain`, para evitar a checagem prévia de CORS) ao Apps Script com `{token, acao, ag}`. Ações: `novo`, `alterado`, `cancelado`, `confirmado`, `cancelado_coord` e `lembretes_agora` (botão do dashboard). O `Code.gs` grava cada agendamento na aba **Agendamentos** da planilha, envia o e-mail ao aluno e, num gatilho diário às 7h, envia os lembretes do dia e o resumo ao coordenador. Só envia para a lista `PERMITIDOS`. Instalação: [`integracoes/gmail/LEIA-ME.md`](../integracoes/gmail/LEIA-ME.md).

## Estilos
- O agendamento usa a **mesma identidade do portal**: barra superior de 62px, menu lateral de 240px com o submenu do Agendamento aberto, trilha de navegação, cartões brancos com sombra leve.
- `agendamento/style.css` em blocos numerados: 1 cores · 2 base · 3 barra superior · 4 menu · 5 conteúdo · 6 formulários e botões · 7 tabelas e status · 8 calendário · 9 chatbot · 10 gestão · 11 avisos e rodapé · 12 telas menores · 13 triagem e orientação.
- Cores em variáveis no `:root`; modo escuro por `prefers-color-scheme`. `--fill` é o azul dos botões preenchidos (mais forte no escuro, para o texto branco ter contraste).
- Celular (até 760px): o menu lateral some e o submenu vira abas no topo.
- Alvos de toque de 44px, campos com fonte de 16px, contraste mínimo de 4,5:1 nos dois modos.

## O que seria preciso para uso real
Banco de dados compartilhado e validação de conflitos no servidor, login institucional (SSO), permissões no servidor (cada coordenador vê só os seus alunos), envio de e-mails pela conta institucional, logs de auditoria, revisão jurídica e de segurança.
