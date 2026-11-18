# E-mails pelo Gmail e banco de dados (gratuito)

Com isto ligado, a planilha vira o **banco de dados compartilhado** (agendamentos vistos em qualquer aparelho, sem horário marcado duas vezes) e o site envia e-mails de verdade, pela conta Gmail de vocês:

| Quando | Quem recebe | E-mail |
|---|---|---|
| Ao agendar | Aluno | "Agendamento recebido", com protocolo, dia, horário, coordenador e sala |
| Alteração ou cancelamento pelo aluno | Aluno | Aviso da alteração ou do cancelamento |
| Coordenador confirma ou cancela | Aluno | "Atendimento confirmado" ou "cancelado pela coordenação" |
| **Todo dia às 7h** | Aluno com atendimento no dia | "Lembrete: seu atendimento é hoje às 10:30", com coordenador e sala |
| **Todo dia às 7h** | Coordenador | "Seus atendimentos de hoje: 3", com horário, aluno, assunto e sala |

**Custo zero:** usa o Google Apps Script da própria conta Google. Limite da conta gratuita: 100 e-mails por dia.

Sem esta configuração, o site funciona normalmente e só não envia e-mails.

---

## Instalação (cerca de 10 minutos)

Use uma conta Gmail da equipe. Os e-mails sairão dela.

### 1. Planilha e código
1. Em [sheets.google.com](https://sheets.google.com), crie uma planilha em branco, por exemplo "Agendamentos – demonstração".
2. Menu **Extensões → Apps Script**.
3. Apague o que estiver no editor e cole todo o conteúdo de [`Code.gs`](Code.gs).
4. No começo do código, em `CONFIG`, ajuste:
   - `TOKEN`: invente uma senha simples, por exemplo `agenda2026`.
   - `COORDENADOR_EMAIL`: o e-mail que vai receber o resumo do dia. Use o de **alguém da equipe**, não o de um professor sem autorização.
   - `PERMITIDOS`: os e-mails da **equipe**, por exemplo `['carlos@gmail.com', 'maria@gmail.com']`. Eles recebem mensagens sem limite.
   - `ABERTO`: com `true` (padrão), **qualquer pessoa** pode testar com o próprio e-mail, com limites diários: `LIMITE_POR_EMAIL_DIA` (3 mensagens por endereço), `LIMITE_PUBLICO_DIA` (50 no total para quem não é da equipe) e `LIMITE_BOTAO_DIA` (10 usos do botão de lembretes). Assim sobra cota para a equipe dentro do limite de 100 por dia do Gmail. Com `false`, só a equipe recebe.
5. Clique em **Salvar** (ícone de disquete).

### 2. Autorizar e testar o envio
1. Na barra de cima, escolha a função **`testarEnvio`** e clique em **Executar**.
2. O Google pede autorização. Como o script é de vocês, aparece "O Google não verificou este app": clique em **Avançado → Acessar (não seguro)** e depois em **Permitir**. Isso é normal para scripts próprios.
3. Confira a caixa de entrada: chega o e-mail "Teste do Agendamento Acadêmico". Olhe também o spam.

### 3. Ligar o lembrete diário das 7h
Escolha a função **`instalarLembreteDiario`** e clique em **Executar**. Pronto: todo dia, entre 7h e 8h, os lembretes saem sozinhos.

### 4. Publicar como "App da Web"
1. Botão azul **Implantar → Nova implantação**.
2. Na engrenagem de "Selecione o tipo", escolha **App da Web**.
3. **Executar como:** Eu. **Quem pode acessar:** Qualquer pessoa.
4. **Implantar** e copie a **URL do app da Web** (termina em `/exec`).
5. Abra essa URL no navegador. Deve aparecer `{"ok":true,"servico":"agendamento-email"}`.

### 5. Ligar no site
Edite [`agendamento/config.js`](../../agendamento/config.js):

```js
window.CFG = {
  EMAIL_API: 'https://script.google.com/macros/s/.../exec',  // a URL do passo 4
  EMAIL_TOKEN: 'agenda2026'                                   // a mesma senha do TOKEN
};
```

Salve e envie ao GitHub. Em 1 a 3 minutos o site publicado passa a enviar e-mails.

---

## Chat com IA (opcional, gratuito)

O chatbot entende frases livres ("não tô vendo a matéria no portal") usando o **Gemini**. A IA só identifica o setor e o assunto; as respostas continuam sendo as do site. Sem a chave, o chatbot funciona como antes.

1. Em [aistudio.google.com/apikey](https://aistudio.google.com/apikey), com uma conta Google da equipe, clique em **Criar chave de API** e copie a chave. **Não coloque a chave no site nem no repositório.**
2. No editor do Apps Script: **Configurações do projeto** (engrenagem, à esquerda) → **Propriedades do script** → **Adicionar propriedade do script**. Propriedade: `GEMINI_KEY`. Valor: a chave. **Salvar propriedades do script**.
3. Volte ao editor, escolha a função **`diagnosticoIA`** e clique em **Executar** (não use "Depuração", que é bem mais lento). Na primeira vez, o Google pede uma nova autorização (acesso a serviços externos): **Avançado → Acessar → Permitir**. Ela lista os modelos da sua conta, mede o tempo de cada um e passa a usar o **mais rápido** (leva até ~4 min).
   Depois, rode **`testarIA`**: devem aparecer três linhas com `"ok":true` e o tempo de cada uma (o ideal é menos de 5 s; o site espera até 10 s).
4. **Implantar → Gerenciar implantações → lápis → Versão: Nova versão → Implantar.**

Se `testarIA` mostrar `"erro":"ia"`, confira a chave; se mostrar `"erro":"limite"`, a cota gratuita do minuto/dia acabou (o chatbot volta a funcionar por palavras-chave).

## Como mostrar na apresentação
1. Agende um atendimento com qualquer e-mail (na apresentação, prefira um da equipe, que não tem limite). A confirmação chega em segundos.
2. Para mostrar o **lembrete do dia** sem esperar até as 7h: agende para **hoje** (se o coordenador atender no dia da apresentação). Depois, na visão do coordenador, em **Dashboard**, clique em **"Enviar os lembretes de hoje agora"**. Chegam o lembrete do aluno e o resumo do coordenador.
3. Na planilha, a aba **Agendamentos** mostra tudo o que o site registrou.

## Se algo não funcionar
- **"Este e-mail não está na lista permitida":** o modo aberto está desligado. Inclua o e-mail em `PERMITIDOS` ou use `ABERTO: true`, salve e publique uma nova versão (veja abaixo).
- **"Limite diário de e-mails da demonstração atingido":** o endereço já recebeu 3 mensagens hoje ou o público já recebeu 50. A equipe não tem limite; os contadores zeram no dia seguinte.
- **"Não foi possível enviar o e-mail agora":** confira se `EMAIL_API` e `EMAIL_TOKEN` em `config.js` estão iguais aos do script, e se a URL abre no navegador.
- **Mudou o `Code.gs` depois de publicar?** Vá em **Implantar → Gerenciar implantações → lápis (editar) → Versão: Nova versão → Implantar**. A URL continua a mesma.
- **Os e-mails caíram no spam:** marque como "Não é spam" uma vez.
- **"Ocorreu um erro desconhecido" no editor:** quase sempre são várias contas Google abertas no mesmo navegador. Use uma janela anônima só com a conta da planilha.
- **A URL pede login do Google:** a implantação está com acesso restrito. Em **Gerenciar implantações → editar**, escolha **Quem pode acessar: Qualquer pessoa** e publique uma nova versão.
- **Rodei `doPost` pelo editor e nada aconteceu:** é normal; essa função só funciona quando o site chama. Para testar pelo editor, use `testarEnvio`.

## Cuidados
- A URL e a senha ficam visíveis no código do site, que é público. As proteções são os limites diários, a remoção de links dos campos de texto e, se precisar, `ABERTO: false`.
- Se notar uso estranho (e-mails para desconhecidos na planilha), mude para `ABERTO: false` e publique uma nova versão.
- A planilha guarda nome e e-mail dos testes. Depois da competição, apague a planilha e, em **Implantar → Gerenciar implantações**, arquive a implantação.
- Use só e-mails da equipe, com o consentimento de cada pessoa.
