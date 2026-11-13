# Chatbot de orientação por setor

> Este é o chatbot **atual, por palavras-chave**. Para a versão com IA, veja [`CHAT-IA.md`](CHAT-IA.md).

Objetivo: evitar encaminhamentos errados, explicando se o assunto é da Coordenação Acadêmica ou de outro setor **antes** do agendamento.

## Setores
| Setor | Responsável por |
|---|---|
| Coordenação Acadêmica | Ajuste e aceite de grade, disciplinas, professores, notas, faltas, presença, reprovações e análise curricular |
| Secretaria Acadêmica | Documentos, histórico escolar, declaração de matrícula, certificados, trancamento e afastamento por longo período (por exemplo, por saúde) |
| Financeiro | Boletos, mensalidades, valores, bolsas, convênios, descontos e o custo de refazer disciplinas |

Os textos ficam em `DS` (descrições) e `NM` (nomes) no `script.js`.

**Regra fixa:** a Coordenação não resolve questões financeiras, não emite documentos e não define valores de mensalidade nem descontos. Esse aviso aparece na tela do chatbot; nas respostas sobre o Financeiro, o chatbot lembra que a coordenação não tem acesso aos dados financeiros (LGPD).

## Como decide
O texto do aluno é normalizado (sem acento, minúsculas) por `N_()` e comparado com palavras-chave de cada setor (`SET`, via `HIT()`). O assunto da coordenação vem de `SUBK`. Tudo acontece em `ask()`:
- 1 setor, Coordenação → explica e mostra um botão: **Ver orientação** (ajuste de grade, reprovação) ou **Agendar** (demais assuntos), que chama `esc_(assunto)`.
- 1 setor, outro → diz que não é da Coordenação, indica o setor, mostra **Ver como resolver** (tela de encaminhamento) e soma o contador de encaminhados.
- Mais de um setor → separa cada parte e mostra o botão da parte acadêmica.
- Nenhum → tenta as respostas de `FAQ` (como agendar, sala, cancelar, protocolo); se não achar, mostra o resumo dos três setores.

As perguntas prontas (botões abaixo da conversa) ficam na tela `chat` de `Sx()`.

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
É um sistema de palavras-chave, não uma IA. Frases sem essas palavras (por exemplo "não tô vendo a matéria no portal") caem na resposta "não consegui identificar". A tabela de testes em [`CHAT-IA.md`](CHAT-IA.md) mostra onde ele acerta e onde falha.
