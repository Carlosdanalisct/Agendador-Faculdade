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
Edite `agendamento/script.js`:
- `SUBK`: palavras de cada assunto da coordenação (`grade`, `reprov`, `nota`, `analise`, `prof`). A lista `coord` de `SET` é montada a partir dela.
- `SET.sec` e `SET.fin`: palavras da Secretaria e do Financeiro.
- Descrições e nomes dos setores ficam em `DS` e `NM`.

Quando o assunto é da coordenação, a resposta traz um botão que leva direto à orientação (ajuste de grade, reprovação) ou ao agendamento já com o assunto escolhido. O mesmo filtro (`av_`) avisa no formulário quando o aluno descreve algo do Financeiro ou da Secretaria.

## Base: entrevista com a coordenação
A triagem foi desenhada a partir de uma entrevista com a coordenação de um dos cursos:
- Cerca de **70% dos atendimentos são ajuste de grade** feito errado pelo aluno, incluindo quem não deu o aceite da grade e quem quer se formar antes do tempo mínimo do curso.
- A segunda dúvida mais comum é **reprovação**: como refazer e quanto custa (o custo é com o Financeiro).
- A maioria se resolve em **cerca de 15 minutos**; análise curricular (aluno vindo de outra instituição) exige mais tempo.
- A coordenação **não tem acesso a dados financeiros** (LGPD). O coordenador vê só o valor cheio do curso, sem bolsas, convênios ou desconto de pontualidade.
- Hoje, quando o aluno chega ao setor errado, o redirecionamento é feito um a um, na conversa.

## Limite
É um sistema de palavras-chave, não uma IA. Frases sem essas palavras caem na resposta "não consegui identificar".
