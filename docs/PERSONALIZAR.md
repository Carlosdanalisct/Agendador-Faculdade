# Personalizar

## Coordenadores, cursos, salas e dias
Edite a lista `CO0` no começo de `agendamento/script.js`. Uma linha por coordenador:

```js
[id, 'Nome', 'Cargo', ['Curso 1','Curso 2'], [dias], 'Sala', 'Local']
```
Exemplo:
```js
[2,'Profª. Marcia Rodrigues','Coordenadora de Curso',['Nutrição','Farmácia'],[2,4],'Sala 105','Bloco A, térreo']
```
- `id`: número único, sem repetir.
- `dias`: de 0 a 6 (0 domingo, 1 segunda ... 5 sexta, 6 sábado).
- `CRS` (lista de cursos do filtro) é gerada sozinha a partir de `CO0`.
- Salas, blocos e dias atuais são **exemplos**.

## Assuntos, motivos e duração
- `CATS`: motivos que aparecem no formulário (só assuntos da coordenação).
- `AS`: assuntos da triagem. Cada item tem setor (`coord`, `sec`, `fin`), duração em minutos (`min`) e se mostra orientação antes de agendar (`faq`).
- `FQ`: textos da orientação na hora. Revise com a coordenação do seu curso.
- Horário de atendimento: função `SLOTS` (hoje 09h–12h e 14h–17h).

## Coordenador da visão de gestão
Sem login real, a gestão sempre mostra o coordenador de **id 1** (filtros `x.co==1` nas telas `dash` e `ag` de `G()`, e o nome no cabeçalho em `R()`). O administrador vê todos.

## E-mails e lembretes
No `Code.gs` (Apps Script), bloco `CONFIG`:
- `COORDENADOR_EMAIL`: quem recebe o resumo do dia;
- `PERMITIDOS`: e-mails que podem receber mensagens;
- `HORA_LEMBRETE`: hora do lembrete diário (padrão 7). Depois de mudar, rode `instalarLembreteDiario` de novo;
- textos dos e-mails: objeto `MODELOS`.

Depois de qualquer mudança: salvar e publicar **Nova versão** (veja [`CONTRIBUINDO.md`](CONTRIBUINDO.md)).

## Nome da instituição e dados do rodapé
Constante `foot` em `script.js`: razão social, CNPJ, endereço e encarregado de dados. Os valores atuais são fictícios. Não use nome, logo ou marca reais da instituição sem autorização.

## Cores
Variáveis em `:root` de `style.css` (portal) e `agendamento/style.css`. Cor principal: `--blue`/`--o` (`#0a4fd6`).

## Imagens e logo
O repositório não inclui logos oficiais. Para usar a logo da instituição, adicione o arquivo na pasta e confirme que há autorização de uso.

## Texto de saudação
O nome vem do login (`pda_nome`). Para mudar o texto, edite "Olá, " em `app.js` (portal) e `<h1>Olá, ...` na tela `home` de `Sx()` em `script.js`.

## Nomes dos coordenadores
Os nomes em `CO0` só devem aparecer no site público com autorização das pessoas. Sem autorização, troque por nomes fictícios.
