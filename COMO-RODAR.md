# Como rodar

## No computador (VS Code)
1. Baixe/clone o repositório e abra a pasta no VS Code.
2. Instale a extensão **Live Server** (Ritwick Dey).
3. Clique com o botão direito em `index.html` → **Open with Live Server**.
4. O site abre em algo como `http://127.0.0.1:5500`.

Abrir o `index.html` com duplo clique costuma funcionar, mas o Live Server é mais confiável para testar a navegação entre as duas páginas.

## No GitHub Pages
1. Crie um repositório **público** e envie os arquivos mantendo as pastas. O `index.html` deve ficar na **raiz**.
2. *Settings → Pages → Build and deployment → Deploy from a branch*.
3. Escolha `main` e `/ (root)` → *Save*.
4. Aguarde 1 a 3 minutos. O endereço é `https://USUARIO.github.io/REPOSITORIO/`.

## Problemas comuns
| Sintoma | Causa provável |
|---|---|
| Página em branco | Sem internet (React vem do CDN) |
| Sem estilo ou erro 404 no botão Agendamento | Arquivos dentro de uma pasta extra: `index.html` precisa estar na raiz |
| Nome não aparece no agendamento | Abriu o agendamento direto, sem passar pelo login do portal |
| Dados sumiram | Normal: ficam só em memória; recarregar zera |

Não renomeie os arquivos sem ajustar os links: `index.html` carrega `style.css` e `app.js`; o portal abre `agendamento/index.html`; o agendamento volta para `../index.html`.
