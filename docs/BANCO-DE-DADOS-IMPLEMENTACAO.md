# Banco de Dados - Implementação Concluída

## O que foi implementado

### 1. Camada de dados no Apps Script (`integracoes/gmail/Code.gs`)

**Nova ação `listar`**: Retorna todos os agendamentos da planilha para sincronização entre dispositivos.

**Novas colunas salvas na planilha**:
- `coordenador_id` - ID do coordenador
- `RA` - Registro do aluno
- `observacoes` - Observações do atendimento

### 2. Camada de dados no site (`agendamento/script.js`)

**Funções adicionadas**:
- `DB_carregarAgendamentos()` - Carrega agendamentos da planilha
- `DB_gravar(acao, ag)` - Grava agendamentos na planilha
- `DB_recarregarSeNecessario()` - Recarrega ao navegar entre telas

**Integração com funções existentes**:
- `sv()` - Usa banco ao criar/alterar agendamentos
- `cx()` - Usa banco ao cancelar
- `up()` - Usa banco ao confirmar/concluir pelo coordenador
- `go()` - Recarrega dados ao mudar de tela

### 3. Configuração (`agendamento/config.js`)

Adicionadas as configurações do banco:
```js
DB_API: 'URL-do-Apps-Script/exec',
DB_TOKEN: 'senha'
```

---

## Como testar (antes da apresentação)

### Passo 1: Atualizar o Apps Script

1. Acesse o editor do Apps Script (extensões → Apps Script)
2. Substitua todo o conteúdo pelo novo `Code.gs`
3. Salve
4. **Implantar → Gerenciar implantações → Editar → Nova versão → Implantar**

### Passo 2: Testar a sincronização

1. **No celular**: Abra o site, faça um agendamento
2. **No notebook**: Abra a tela do coordenador, atualize a página
3. O agendamento deve aparecer

### Passo 3: Verificar conflitos

1. Dois dispositivos tentam o mesmo horário simultaneamente
2. O segundo deve receber: "Horário acabou de ser ocupado. Escolha outro."

---

## Checklist de verificação

- [ ] Agendamento no celular aparece na tela do coordenador
- [ ] Alteração de horário funciona em todos os dispositivos
- [ ] Cancelamento libera o horário para outros
- [ ] Coordenador consegue confirmar/cancelar e aluno vê a atualização
- [ ] Sem internet, o site continua funcionando (localStorage como backup)

---

## Se algo não funcionar

1. **"Token inválido"**: Verifique se `DB_TOKEN` em `config.js` é igual a `CONFIG.TOKEN` no Apps Script
2. **Dados não aparecem**: Verifique o console do navegador (F12) para erros
3. **URL do Apps Script mudou**:Atualize `DB_API` em `config.js`
4. **Planilha com colunas erradas**: delete a aba "Agendamentos" e deixe o Apps Script recriar