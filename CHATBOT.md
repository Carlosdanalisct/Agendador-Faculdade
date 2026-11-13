# Chatbot de orientação por setor

Objetivo: evitar encaminhamentos errados, explicando se o assunto é da Coordenação Acadêmica ou de outro setor **antes** do agendamento.

## Setores
| Setor | Responsável por |
|---|---|
| Coordenação Acadêmica | Curso, professores, disciplinas, grade curricular, notas, faltas, reprovações e questões acadêmicas |
| Secretaria Acadêmica | Documentos, histórico escolar, declaração de matrícula, certificados, trancamento e afastamento |
| Financeiro | Boletos, mensalidades, cobranças, bolsas, convênios, descontos e problemas financeiros |

**Regra fixa:** a Coordenação não resolve questões financeiras, não emite documentos e não define valores de mensalidade nem descontos. Esse lembrete aparece nas respostas.

## Como decide
O texto do aluno é normalizado (sem acento, minúsculas) e comparado com palavras-chave de cada setor (`SET` em `script.js`):
- 1 setor encontrado, Coordenação → orienta a agendar.
- 1 setor encontrado, outro → diz que não é da Coordenação e indica o setor.
- Mais de um setor → separa cada parte e indica quem resolve.
- Nenhum → mostra o resumo dos três setores e pede mais detalhes.

A comparação usa o **início** das palavras (ex.: `falt` pega "falta" e "faltas").

## Incluir palavras
Edite `SET` em `agendamento/script.js`:
```js
const SET={coord:['curso','nota','falt', ...], sec:['document','tranc', ...], fin:['boleto','mensalidad', ...]};
```
Descrições e nomes dos setores ficam em `DS` e `NM`.

## Limite
É um sistema de palavras-chave, não uma IA. Frases sem essas palavras caem na resposta "não consegui identificar".
