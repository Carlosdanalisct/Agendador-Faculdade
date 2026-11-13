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

## Categorias de motivo
Lista `CATS` em `script.js`.

## Nome da instituição e dados do rodapé
Constante `foot` em `script.js`: razão social, CNPJ, endereço e encarregado de dados. Os valores atuais são fictícios.

## Cores
Variáveis em `:root` de `style.css` (portal) e `agendamento/style.css`. Cor principal: `--blue`/`--o` (`#0a4fd6`).

## Imagens e logo
O repositório não inclui logos oficiais. Para usar a logo da instituição, adicione o arquivo na pasta e confirme que há autorização de uso.

## Texto de saudação
O nome vem do login (`pda_nome`). Para mudar o texto, edite "Olá, " em `app.js` (portal) e `<h1>Olá, ...` em `script.js`.
