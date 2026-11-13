# Guia: banco de dados

Para a equipe que vai criar o banco de dados compartilhado.

## Objetivo

Hoje cada navegador guarda os próprios dados (`localStorage`). Por isso:
- um agendamento feito no **celular** de um aluno **não aparece** na tela do coordenador em outro computador;
- dois alunos em aparelhos diferentes podem marcar o **mesmo horário**;
- os contadores da triagem só valem para aquele navegador.

O banco de dados deve tornar agendamentos, horários ocupados e protocolos **os mesmos para todos**, em qualquer aparelho.

**Critério de pronto para a demonstração:** um aluno agenda pelo celular e, ao recarregar a tela do coordenador no notebook, o atendimento aparece; o horário escolhido fica ocupado para todos.

## O que existe hoje

### Coleções em memória (`agendamento/script.js`)
| Coleção | Registro | Observações |
|---|---|---|
| `CO` | `{id, n, r, cs[], c, d[], s, l}` | Coordenador: nome, cargo, cursos, dias da semana (0 = domingo … 6 = sábado), sala, local. Vem da lista fixa `CO0`; a gestão pode acrescentar (`ac_`) |
| `A` | `{p, a, ra, co, c, dt, h, dur, s, m, st, o, em}` | Agendamento: protocolo `AGD-AAAA-N`, aluno, RA, id do coordenador, cursos, data `AAAA-MM-DD`, hora `HH:MM`, duração em minutos, sala, assunto, status, observações do coordenador, e-mail do aluno |
| `P` | `{p, as, dt, st, tl[]}` | Solicitação/protocolo `SOL-AAAA-N`: assunto, data de abertura `DD/MM/AAAA`, status, andamento |
| `TRI` | `{res, enc}` | Resolvidos sem agendamento e encaminhados a outro setor |
| `N` | número | Último número usado nos protocolos |

Listas fixas que podem continuar no código ou ir para o banco: `CATS`/`AS` (assuntos, setor, duração), `CRS` (cursos), `NT` (avisos de exemplo), `RD` (dados fictícios dos relatórios).

### Persistência atual
- `salva()` grava `{me, A, P, N, CO, TRI}` em `localStorage['pda_demo2']` **a cada navegação** (`go()`).
- No carregamento, um bloco logo após `salva()` lê esse conteúdo e substitui os dados de exemplo.
- `rst()` apaga e recarrega (link "Reiniciar demonstração").

### Onde os dados são gravados (pontos de escrita)
| Função | O que faz | Equivalente no banco |
|---|---|---|
| `sv()` | Cria agendamento (novo) ou muda `dt`/`h` (alteração, quando `S.re`) | `INSERT` / `UPDATE agendamento` |
| `cx()` (botão da janela) | Status → `Cancelado` | `UPDATE status` |
| `up(p, s)` | Coordenador muda status e observações | `UPDATE status, observacoes` |
| `ns()` | Nova solicitação em `P` | `INSERT solicitacao` |
| `ac_()` | Novo coordenador em `CO` | `INSERT coordenador` |
| Tela `faq` ("Sim, resolvi"), `esc_()`, `ask()` | Somam `TRI.res` / `TRI.enc` | `INSERT evento_triagem` |

### Onde os dados são lidos (pontos de leitura)
- `occ(co, data, hora, duração)`: **conflito de horário**. Hoje olha `A` + uma ocupação fictícia (`ocu15`). Com banco, precisa dos agendamentos não cancelados do coordenador naquele dia.
- Telas do aluno (`Sx`): `home`, `hist`, `det`, `conf` filtram `A` por `x.a == ME` (o aluno é identificado pelo **nome**, porque não há login real).
- Telas da gestão (`G`): `dash`, `ag` filtram `A` por `x.co == 1` (coordenador de exemplo) ou tudo, se administrador.

### A planilha que já existe
O serviço de e-mails (`integracoes/gmail/Code.gs`) **já grava cada agendamento** na aba **Agendamentos** de uma planilha Google, com as colunas:

`protocolo, aluno, email, coordenador, data, hora, duracao, sala, local, assunto, status, lembrete_enviado, atualizado_em`

Ela é atualizada a cada evento (`salvar()` no `Code.gs`, uma linha por protocolo). Não guarda `co` (id do coordenador), `ra` nem observações.

## Caminhos possíveis

| Opção | Como | Prós | Contras |
|---|---|---|---|
| **A. Planilha Google como banco** (recomendado para a competição) | Ampliar o `Code.gs`: guardar todos os campos e criar ações de leitura (`listar`) e de checagem de conflito | Sem custo, sem cadastro novo; já está no ar e já recebe os agendamentos | Lento para muitos dados (1–3 s por chamada); sem consultas complexas; a senha fica pública |
| B. Firebase (Firestore) | SDK no navegador + regras de segurança | Tempo real, plano gratuito, sem servidor | Exige conta, regras bem escritas (LGPD) e mais código |
| C. Supabase (PostgreSQL) | API REST/SDK + políticas de linha (RLS) | SQL de verdade, plano gratuito | Exige conta e políticas RLS; cuidado para não expor a chave de serviço |
| D. Servidor próprio (Node/Python + PostgreSQL/MySQL) | API própria hospedada | Controle total; caminho para produção | Hospedagem, manutenção e mais tempo |

Para a versão real, o caminho natural é **D** (ou B/C), com login institucional.

## Modelo de dados sugerido

```sql
coordenador (id PK, nome, cargo, email, sala, local)
curso       (id PK, nome, modalidade)
coordenador_curso (coordenador_id FK, curso_id FK)
dia_atendimento   (coordenador_id FK, dia_semana 0-6, inicio, fim)
assunto     (chave PK, titulo, setor 'coord'|'sec'|'fin', duracao_min, tem_orientacao)
aluno       (id PK, nome, ra, email)                     -- na demonstração, só nome e e-mail
agendamento (protocolo PK, aluno_id FK, coordenador_id FK, assunto_chave FK,
             data, hora, duracao_min, sala, descricao, observacoes,
             status 'Pendente'|'Confirmado'|'Concluído'|'Cancelado',
             lembrete_enviado_em, criado_em, atualizado_em)
solicitacao (protocolo PK, aluno_id FK, assunto, status, aberta_em)
solicitacao_andamento (protocolo FK, quando, texto)
evento_triagem (id PK, tipo 'resolvido'|'encaminhado', assunto_chave, quando)
```

Regras importantes:
- **Conflito de horário no servidor:** antes de gravar, verificar se existe agendamento não cancelado do mesmo coordenador que se sobreponha a `[hora, hora + duração)`. Hoje isso só acontece no navegador (`occ()`).
- **Protocolo único:** gerar no servidor (hoje é `N` do navegador, que pode repetir entre aparelhos).
- **Status:** `Pendente` → `Confirmado` → `Concluído`; `Cancelado` em qualquer momento; alteração mantém o protocolo e zera o lembrete.

## Contrato sugerido (se seguir a opção A)

O site já envia ao Apps Script: `POST` com corpo JSON em `text/plain` `{token, acao, ag}`. Basta acrescentar ações:

| Ação | Envia | Responde |
|---|---|---|
| `novo`, `alterado`, `cancelado`, `confirmado`, `cancelado_coord` | `ag` (como hoje, incluindo `co`, `ra`, `observacoes`) | `{ok:true}` ou `{ok:false, erro:'conflito'}` |
| `listar` | `{coordenador?, aluno?, de?, ate?}` | `{ok:true, agendamentos:[...]}` |
| `triagem` | `{tipo, assunto}` | `{ok:true}` |

Lembretes: ao mudar o `Code.gs`, **publicar uma nova versão** (Implantar → Gerenciar implantações → editar → Nova versão). Senão o site continua chamando a versão antiga.

## Mudanças no site (passo a passo sugerido)

1. **Criar uma camada de dados** em `script.js`, por exemplo `carregarDados()`, `gravarAgendamento(x)`, `mudarStatus(p, st, obs)`, `gravarSolicitacao(s)`, `registrarTriagem(tipo)`. Trocar as gravações diretas listadas acima por essas funções.
2. **Carregar do banco ao abrir** a página (e ao entrar nas telas `home`, `hist`, `dash`, `ag`), substituindo o conteúdo de `A`/`P`/`TRI`. Mostrar um "Carregando…" curto.
3. **`occ()`**: usar os agendamentos do banco do coordenador/dia. Manter a ocupação fictícia (`ocu15`) só se quiserem a agenda "cheia" na demonstração.
4. **`sv()`**: gravar no banco e só ir para `conf` se a resposta for `ok`; tratar `conflito` com o aviso que já existe ("Horário acabou de ser ocupado. Escolha outro.").
5. **Sem internet:** manter o `localStorage` como cópia e mostrar um aviso, para a demonstração não travar.
6. **E-mails:** se o banco for a própria planilha, unificar: o mesmo registro serve aos dois. Se for outro banco, o envio pode continuar no Apps Script ou ir para o servidor novo.
7. **Identidade:** sem login real, o aluno é o **nome** (`ME`) e o coordenador da gestão é o **id 1**. Se o banco tiver `aluno`, considere usar o e-mail como identificador na demonstração.

## Cuidados (LGPD e segurança)
- Guardar só o necessário: nome, e-mail, assunto e descrição. **Não** guardar CPF nem senha (o login atual não guarda).
- Na demonstração, usar dados da equipe ou fictícios.
- Tudo o que está no site é público, inclusive chaves e senhas. Nunca colocar no navegador uma chave com permissão de administrador do banco.
- Escapar texto digitado ao exibir (`E()` no `script.js`) e validar no servidor.
- Depois da competição, apagar os dados de teste.

## Checklist de testes
- [ ] Agendar no celular e ver no notebook (tela do coordenador) após recarregar.
- [ ] Dois aparelhos tentando o mesmo horário: o segundo recebe o aviso de horário ocupado.
- [ ] Alterar e cancelar refletem nos dois aparelhos; o horário cancelado volta a ficar livre.
- [ ] Coordenador confirma → aluno vê "Confirmado" e recebe o e-mail.
- [ ] Contadores da triagem somam de todos os aparelhos.
- [ ] Sem internet, o site continua funcionando com aviso.
- [ ] Fluxos antigos continuam: triagem, horários de 15/45 min, `.ics`, e-mails, modo escuro, celular (veja o checklist em [`CONTRIBUINDO.md`](CONTRIBUINDO.md)).
