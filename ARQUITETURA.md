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

## Agendamento (`script.js`, JavaScript puro)
Cada tela é um texto HTML montado em `R()` e inserido em `#app`. A navegação usa `go(página, id)`, que atualiza o estado `S` e redesenha.

**Ambientes** (`S.env`): `aluno` (padrão) e `ges` (gestão). A gestão abre pelo link *Acesso da gestão* no rodapé.

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
- Variáveis de cor em `:root`; modo escuro por `prefers-color-scheme`.
- **Mobile first**: regras base são do celular; `min-width` (640px, 900px) amplia o layout.
- Alvos de toque de pelo menos 44px, fonte de 16px nos campos.

## O que seria preciso para uso real
Servidor e banco de dados, login institucional (SSO), envio de e-mails/notificações, controle de permissões no servidor, logs de auditoria e revisão jurídica.
