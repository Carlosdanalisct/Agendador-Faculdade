# Como rodar

## Site publicado
- Aluno: https://carlosdanalisct.github.io/Agendador-Faculdade/
- Coordenação: https://carlosdanalisct.github.io/Agendador-Faculdade/#gestao

O GitHub Pages publica a branch `main` (pasta raiz). Cada merge atualiza o site em 1 a 3 minutos. Se o navegador mostrar a versão antiga, use **Ctrl + Shift + R**.

## No computador (VS Code)
1. Clone o repositório e abra a pasta no VS Code.
2. Instale a extensão **Live Server** (Ritwick Dey).
3. Clique com o botão direito em `index.html` → **Open with Live Server**.
4. O site abre em algo como `http://127.0.0.1:5500`.

Abrir o `index.html` com duplo clique costuma funcionar, mas o Live Server é mais confiável para a navegação entre as duas páginas.

**E-mails no computador:** o `agendamento/config.js` da `main` aponta para o Apps Script da equipe, então os e-mails também saem quando você testa localmente (só para a lista `PERMITIDOS`). Para testar sem enviar nada, deixe `EMAIL_API: ''` **na sua cópia local** e não envie essa mudança.

## Publicar em outro repositório (GitHub Pages)
1. Repositório **público**, com os arquivos nas mesmas pastas. O `index.html` fica na **raiz**.
2. *Settings → Pages → Build and deployment → Deploy from a branch*.
3. Escolha `main` e `/ (root)` → *Save*.
4. Aguarde 1 a 3 minutos. O endereço é `https://USUARIO.github.io/REPOSITORIO/`.

## Ligar os e-mails
Passo a passo em [`integracoes/gmail/LEIA-ME.md`](../integracoes/gmail/LEIA-ME.md). Em resumo: colar o `Code.gs` num Apps Script de uma planilha, configurar `TOKEN`, `COORDENADOR_EMAIL` e `PERMITIDOS`, rodar `testarEnvio` e `instalarLembreteDiario`, publicar como App da Web (acesso "Qualquer pessoa") e colar a URL e a senha no `agendamento/config.js`.

## Problemas comuns
| Sintoma | Causa provável |
|---|---|
| Página em branco | Sem internet (o React vem do CDN) |
| Sem estilo ou erro 404 no Agendamento | Arquivos numa pasta extra: o `index.html` precisa estar na raiz |
| Nome não aparece no agendamento | Abriu o agendamento direto, sem passar pelo login do portal |
| Dados sumiram | Ficam só no navegador usado; outro navegador ou janela anônima começa do zero. **Reiniciar demonstração** (rodapé) volta aos dados de exemplo |
| Aluno agendou no celular e não aparece para o coordenador | Esperado hoje: os dados são por navegador (veja [`BANCO-DE-DADOS.md`](BANCO-DE-DADOS.md)) |
| "Este e-mail não está na lista permitida" | O e-mail não está em `PERMITIDOS`, ou a lista foi alterada sem publicar **Nova versão** no Apps Script |
| "Não foi possível enviar o e-mail agora" | `EMAIL_API`/`EMAIL_TOKEN` diferentes dos do Apps Script, ou implantação sem acesso "Qualquer pessoa" |
| Nenhum dia disponível hoje | Cada coordenador atende em dias fixos (lista `CO0` em `script.js`); escolha outro coordenador |
| Login recusado | Nome com 2+ letras, CPF com 11 números e senha com 6+ caracteres |

Não renomeie arquivos sem ajustar os links: `index.html` carrega `style.css` e `app.js`; o portal abre `agendamento/index.html`; o agendamento volta para `../index.html` e carrega `config.js` antes de `script.js`.
