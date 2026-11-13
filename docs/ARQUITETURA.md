# Arquitetura

Site estático (sem build, sem servidor). Duas páginas independentes ligadas por link relativo.

```
index.html ──carrega──> style.css, app.js (+ React e React DOM por CDN)
     │  botão "Agendamento"
     ▼
agendamento/index.html ──carrega──> style.css, script.js
     │  botão "Voltar ao portal" (../index.html)
```

## Portal do Aluno (`app.js`, React)
| Componente | Função |
|---|---|
| `App` | Decide entre Login e Portal conforme o nome salvo |
| `Login` | Campos nome, CPF e senha; valida e chama `onEnter(nome)` |
| `Portal` | Página inicial; mostra "Olá, *nome*" |
| `Topbar`, `Sidebar` | Barra superior (botão Sair) e menu lateral |
| `Quick`, `Task`, `Banner` | Cards de acesso rápido, tarefas e banner |
| `validCpf`, `maskCpf` | Validação por dígitos verificadores e máscara |

Estado: `useState`. Persistência: apenas `localStorage['pda_nome']`.

No agendamento, `localStorage['pda_demo']` guarda agendamentos, protocolos e coordenadores da demonstração (salvo a cada navegação em `go()`), e `localStorage['pda_ck']` guarda a escolha do aviso de cookies. A confirmação oferece **Adicionar à minha agenda** (arquivo `.ics`, função `ics()`).

## Agendamento (`script.js`, JavaScript puro)
Cada tela é um texto HTML montado em `R()` e inserido em `#app`. A navegação usa `go(página, id)`, que atualiza o estado `S` e redesenha.

**Ambientes** (`S.env`): `aluno` (padrão) e `ges` (gestão). A gestão abre pelo login do portal (aba *Sou coordenador*), que leva a `agendamento/index.html?gestao=coord` ou `?gestao=adm`. Com esse parâmetro a página já começa no Dashboard, inclusive ao recarregar. *Sair* e o link *Acesso da coordenação* do rodapé voltam para `index.html#gestao`.

**Telas do aluno** (menu `STU`): `home` Início · `busca` Atendimentos · `perfil` · `agenda` · `form` · `conf` · `hist` Histórico e protocolos · `det` · `notif` · `chat`.

**Telas da gestão** (`GES` e `ADM`): `dash`, `ag`, `min`, `salas`, `prot`, `rel`, `perf`, `coord`, `cur`, `perm`, `cfg`.

**Páginas legais:** `priv`, `termos`, `reemb`, `conf17`.

## Dados (no começo de `script.js`)
| Variável | O que guarda |
|---|---|
| `CO0` / `CO` | Coordenadores (id, nome, cargo, cursos, dias, sala, local) |
| `CRS` | Lista de cursos, gerada a partir de `CO0` |
| `CATS` | Categorias de motivo do agendamento |
| `A` | Agendamentos de exemplo |
| `P` | Protocolos de exemplo |

## Estilos
- O agendamento usa a **mesma identidade do portal**: barra superior de 62px com logo, busca e notificações; menu lateral de 240px com os itens do portal e o submenu do Agendamento aberto; trilha de navegação ("Início › Agendamento › …"); cartões brancos com sombra leve; títulos de página discretos. A saudação grande ("Olá, nome") aparece só no Início, como no portal.
- `agendamento/style.css` é organizado em 12 blocos numerados (cores, base, barra superior, menu, conteúdo, formulários, tabelas, calendário, chatbot, gestão, avisos, celular).
- Variáveis de cor em `:root`; modo escuro por `prefers-color-scheme`. `--fill` é o azul dos botões preenchidos (mais forte no modo escuro, para o texto branco ter contraste).
- No celular (até 760px) o menu lateral some, como no portal, e o submenu vira abas no topo.
- Alvos de toque de pelo menos 44px, fonte de 16px nos campos, contraste mínimo de 4,5:1 nos dois modos.

## O que seria preciso para uso real
Servidor e banco de dados, login institucional (SSO), envio de e-mails/notificações, controle de permissões no servidor, logs de auditoria e revisão jurídica.
