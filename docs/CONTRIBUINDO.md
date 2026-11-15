# Contribuindo

Como trabalhar no projeto sem quebrar o que já funciona. Vale para todas as equipes (banco de dados, chat com IA, ajustes).

## Fluxo de trabalho

1. Atualize a `main` e crie uma branch com nome claro: `banco-planilha`, `chat-ia-gemini`, `ajuste-calendario`…
2. Faça as mudanças e teste localmente (Live Server; veja [`COMO-RODAR.md`](COMO-RODAR.md)).
3. Abra um **pull request** para a `main` descrevendo **o que muda**, **por quê** e **como foi testado**. Se mudou algo visual, inclua prints (computador e celular).
4. Alguém da equipe revisa e faz o merge. **A `main` é o site publicado**: em 1 a 3 minutos o GitHub Pages atualiza.
5. Depois do merge, abra o site publicado e repita o teste principal. Use **Ctrl + Shift + R** para não pegar a versão guardada.

Não envie direto para a `main`.

## Convenções do código

- **Sem build e sem dependências novas** no site, a menos que a equipe combine. O React vem por CDN.
- `agendamento/script.js` é escrito de forma **compacta** (nomes curtos, telas como texto HTML). Siga o estilo ao redor e use os utilitários existentes:
  - `go(tela, parâmetro)` para navegar, nunca `R()` direto, porque `go` também salva;
  - `E(texto)` para **escapar** qualquer coisa digitada pelo usuário antes de colocar no HTML;
  - `tt(mensagem)` para avisos rápidos; `mo(html)` / `cm()` para janelas;
  - `I('nome')` para ícones (lista em `IC`).
- Textos da interface em **português**, frases curtas, sem jargão técnico para o aluno.
- **Estilos:** use as variáveis de cor do `:root` (`--o`, `--fill`, `--tx`, `--mu`, `--ln`…) e coloque o CSS novo no bloco certo de `agendamento/style.css` (blocos numerados). Teste no **modo escuro**.
- **Acessibilidade:** rótulo em todo campo (`<label for>`), botões de verdade (`<button>`/`<a href>`), contraste mínimo de 4,5:1, alvos de toque de 44px.
- Comentários e documentação em português. Se mudar comportamento, **atualize o doc correspondente** em `docs/`.

## Segredos e dados pessoais

- O repositório e o site são **públicos**. Tudo o que estiver no `config.js` ou no código pode ser lido por qualquer pessoa.
- O `EMAIL_API` e o `EMAIL_TOKEN` do `config.js` estão públicos de propósito (o site precisa deles). A proteção é a lista `PERMITIDOS` do `Code.gs`.
- **Chaves de IA, chaves de administrador de banco e senhas reais nunca vão para o repositório.** Guarde-as no servidor (por exemplo, nas Propriedades do script do Apps Script).
- Use dados fictícios ou da equipe. **Não** coloque no repositório transcrições de entrevistas nem dados pessoais de professores ou alunos.

## Apps Script (`integracoes/gmail/Code.gs`)

- O arquivo no repositório é a **fonte**. Mudou? Atualize o repositório **e** o editor do Apps Script.
- Depois de colar no editor: **Salvar** e **Implantar → Gerenciar implantações → lápis → Versão: Nova versão → Implantar**. Sem a nova versão, o site continua usando a antiga. A URL não muda.
- "Ocorreu um erro desconhecido" no editor costuma ser **várias contas Google abertas**: use uma janela anônima só com a conta da planilha.

## Checklist de testes antes do pull request

Teste no computador e no celular (ou na largura de celular do navegador), e no modo claro e no escuro.

**Portal**
- [ ] Login de aluno com qualquer CPF de 11 números; menos de 11 mostra erro.
- [ ] Login de coordenador (aba "Sou coordenador") abre o Dashboard; recarregar a página mantém a gestão.
- [ ] No celular, o card "Agendar atendimento" leva ao agendamento.

**Agendamento (aluno)**
- [ ] Triagem: "Ajuste de grade" → orientação → "Sim, resolvi" volta ao início.
- [ ] "Boleto…" → tela do Financeiro; "Documentos…" → tela da Secretaria.
- [ ] "Notas, faltas e presença" → horários de 15 min; "Análise curricular" → horários de 45 min.
- [ ] Formulário: assunto já preenchido; escrever "boleto" mostra o aviso amarelo; e-mail obrigatório quando o envio está ligado.
- [ ] Confirmação mostra o protocolo; "Adicionar à minha agenda" baixa o `.ics`.
- [ ] Alterar e cancelar pelo detalhe do agendamento.
- [ ] Chatbot: "Minha disciplina não aparece" mostra o botão que leva à orientação.

**Coordenação**
- [ ] Agendamentos → Detalhes → Confirmar muda o status (e envia e-mail, se ligado).
- [ ] Dashboard mostra os indicadores da triagem; "Enviar os lembretes de hoje agora" responde.
- [ ] Relatórios filtram.

**Geral**
- [ ] Nenhum erro no console do navegador (F12 → Console).
- [ ] "Reiniciar demonstração" volta aos dados de exemplo.
- [ ] Textos legíveis no modo escuro.
