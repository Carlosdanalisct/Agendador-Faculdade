/**
 * Agendamento Acadêmico — envio de e-mails pelo Gmail (Google Apps Script)
 *
 * Gratuito: roda na sua própria conta Google e envia pelo seu Gmail.
 * Limite da conta gratuita: 100 e-mails por dia.
 *
 * O que faz:
 *  - Recebe do site cada agendamento (novo, alterado, cancelado, confirmado),
 *    guarda na aba "Agendamentos" desta planilha e envia o e-mail ao aluno.
 *  - Todo dia às 7h (gatilho instalado por instalarLembreteDiario):
 *      • envia o lembrete "seu atendimento é hoje" a cada aluno do dia;
 *      • envia ao coordenador o resumo com os atendimentos do dia.
 *
 * Instalação passo a passo: LEIA-ME.md nesta pasta.
 */

// ===================== CONFIGURAÇÃO (edite aqui) =====================
const CONFIG = {
  // A mesma senha colocada em agendamento/config.js (EMAIL_TOKEN).
  TOKEN: 'troque-esta-senha',
  // Quem recebe o resumo do dia. Use o e-mail de alguém da equipe.
  COORDENADOR_EMAIL: 'coordenador.demo@gmail.com',
  // Só estes e-mails podem receber mensagens (protege contra uso indevido,
  // já que o endereço do serviço fica público no site). Use os da equipe.
  // Lista vazia [] = aceita qualquer e-mail (não recomendado).
  PERMITIDOS: ['seuemail@gmail.com'],
  HORA_LEMBRETE: 7,
  FUSO: 'America/Sao_Paulo',
  REMETENTE: 'Agendamento Acadêmico (demonstração)',
};
// =====================================================================

const ABA = 'Agendamentos';
const COLS = ['protocolo', 'aluno', 'email', 'coordenador', 'data', 'hora', 'duracao',
  'sala', 'local', 'assunto', 'status', 'lembrete_enviado', 'atualizado_em'];
const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

/** Chamado pelo site (POST com JSON em texto). */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse(e.postData.contents);
    if (d.token !== CONFIG.TOKEN) return resposta({ ok: false, erro: 'token' });
    if (d.acao === 'lembretes_agora') return resposta(Object.assign({ ok: true }, enviarLembretesDoDia(true)));
    const a = d.ag || {};
    if (!a.protocolo || !/^AGD-\d{4}-\d+$/.test(a.protocolo)) return resposta({ ok: false, erro: 'dados' });
    if (a.email && !emailValido(a.email)) return resposta({ ok: false, erro: 'email' });
    if (a.email && !permitido(a.email)) return resposta({ ok: false, erro: 'nao_permitido' });
    salvar(d.acao, a);
    if (a.email && MODELOS[d.acao]) emailAluno(d.acao, a);
    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Permite testar no navegador se o serviço está no ar. */
function doGet() {
  return resposta({ ok: true, servico: 'agendamento-email' });
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ----------------------------- planilha -----------------------------
function aba() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ABA);
  if (!sh) {
    sh = ss.insertSheet(ABA);
    sh.appendRow(COLS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function linhas() {
  const v = aba().getDataRange().getValues();
  return v.slice(1).map((r, i) => {
    const o = { _linha: i + 2 };
    COLS.forEach((c, j) => { o[c] = String(r[j]); });
    return o;
  });
}

/** Cria ou atualiza a linha do protocolo. Datas e horas vão como texto ("'"). */
function salvar(acao, a) {
  const sh = aba();
  const atual = linhas().find(r => r.protocolo === a.protocolo);
  const status = acao === 'cancelado' || acao === 'cancelado_coord' ? 'Cancelado'
    : acao === 'confirmado' ? 'Confirmado' : (a.status || 'Pendente');
  const lembrete = acao === 'alterado' ? '' : (atual ? atual.lembrete_enviado : '');
  const valores = [a.protocolo, a.aluno, a.email || (atual && atual.email) || '', a.coordenador,
    "'" + a.data, "'" + a.hora, a.duracao, a.sala, a.local, a.assunto, status, lembrete,
    Utilities.formatDate(new Date(), CONFIG.FUSO, 'dd/MM/yyyy HH:mm')];
  if (atual) sh.getRange(atual._linha, 1, 1, COLS.length).setValues([valores]);
  else sh.appendRow(valores);
}

// ------------------------------ e-mails ------------------------------
const MODELOS = {
  novo: a => ['Agendamento recebido: ' + a.protocolo,
    'Recebemos o seu pedido de atendimento com <b>' + h(a.coordenador) + '</b>. No dia do atendimento, às ' + CONFIG.HORA_LEMBRETE + 'h, você recebe um lembrete.'],
  alterado: a => ['Agendamento alterado: ' + a.protocolo,
    'O seu atendimento foi alterado para o novo horário abaixo. O lembrete acompanha a nova data.'],
  cancelado: a => ['Cancelamento registrado: ' + a.protocolo,
    'Você cancelou este atendimento. O horário foi liberado para outros alunos.'],
  confirmado: a => ['Atendimento confirmado: ' + a.protocolo,
    '<b>' + h(a.coordenador) + '</b> confirmou o seu atendimento.'],
  cancelado_coord: a => ['Atendimento cancelado pela coordenação: ' + a.protocolo,
    'A coordenação cancelou este atendimento. Se ainda precisar, faça um novo agendamento.'],
  lembrete: a => ['Lembrete: seu atendimento é hoje às ' + a.hora,
    'Hoje você tem atendimento com <b>' + h(a.coordenador) + '</b> em <b>' + h(a.sala) + '</b>. Chegue com alguns minutos de antecedência e leve o número do protocolo.'],
};

function emailAluno(tipo, a) {
  const [assunto, texto] = MODELOS[tipo](a);
  const corpo = '<p>Olá, ' + h(primeiroNome(a.aluno)) + '!</p><p>' + texto + '</p>' + tabela([
    ['Protocolo', a.protocolo],
    ['Quando', dataBR(a.data) + ' às ' + a.hora + ' (' + a.duracao + ' min)'],
    ['Com', a.coordenador],
    ['Local', a.sala + ', ' + a.local],
    ['Assunto', a.assunto],
  ]);
  enviar(a.email, assunto, corpo);
}

/** Lembretes do dia. forcar=true reenvia mesmo se já enviado (botão de demonstração). */
function enviarLembretesDoDia(forcar) {
  const hoje = Utilities.formatDate(new Date(), CONFIG.FUSO, 'yyyy-MM-dd');
  const doDia = linhas().filter(r => r.data === hoje && r.status !== 'Cancelado')
    .sort((x, y) => x.hora.localeCompare(y.hora));
  let alunos = 0;
  doDia.forEach(r => {
    if ((forcar || !r.lembrete_enviado) && r.email && permitido(r.email)) {
      emailAluno('lembrete', r);
      aba().getRange(r._linha, COLS.indexOf('lembrete_enviado') + 1)
        .setValue(Utilities.formatDate(new Date(), CONFIG.FUSO, 'dd/MM/yyyy HH:mm'));
      alunos++;
    }
  });
  let coordenador = false;
  if (doDia.length && CONFIG.COORDENADOR_EMAIL) {
    const n = doDia.length;
    const corpo = '<p>Bom dia!</p><p>Hoje, ' + dataBR(hoje) + ', você tem <b>' + n + ' atendimento' + (n > 1 ? 's' : '') + '</b>:</p>'
      + '<table style="border-collapse:collapse;font-size:14px">'
      + '<tr>' + ['Horário', 'Aluno', 'Assunto', 'Sala', 'Situação'].map(t => '<th style="text-align:left;padding:6px 12px 6px 0;color:#566170;font-weight:500">' + t + '</th>').join('') + '</tr>'
      + doDia.map(r => '<tr>' + [r.hora + ' (' + r.duracao + ' min)', r.aluno, r.assunto, r.sala, r.status]
        .map(t => '<td style="padding:6px 12px 6px 0;border-top:1px solid #e3e8ee">' + h(t) + '</td>').join('') + '</tr>').join('')
      + '</table>';
    enviar(CONFIG.COORDENADOR_EMAIL, 'Seus atendimentos de hoje: ' + n, corpo);
    coordenador = true;
  }
  return { alunos: alunos, coordenador: coordenador, atendimentos: doDia.length };
}

function enviar(para, assunto, corpoHtml) {
  const html = '<div style="font-family:Arial,sans-serif;font-size:15px;color:#1c2430;max-width:560px">'
    + corpoHtml
    + '<p style="color:#566170;font-size:12px;margin-top:24px">Mensagem automática do protótipo de Agendamento Acadêmico (demonstração). Não responda.</p></div>';
  MailApp.sendEmail({ to: para, subject: assunto, htmlBody: html, name: CONFIG.REMETENTE });
}

// --------------------------- utilitários ----------------------------
function tabela(linhas) {
  return '<table style="border-collapse:collapse;margin:12px 0;font-size:14px">' + linhas.map(([k, v]) =>
    '<tr><th style="text-align:left;padding:6px 16px 6px 0;color:#566170;font-weight:500">' + h(k) + '</th><td style="padding:6px 0">' + h(v) + '</td></tr>').join('') + '</table>';
}
function h(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function dataBR(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return DIAS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] + ', ' + String(d).padStart(2, '0') + '/' + String(m).padStart(2, '0') + '/' + y;
}
function primeiroNome(n) { return String(n || '').trim().split(/\s+/)[0] || 'aluno(a)'; }
function emailValido(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e)); }
function permitido(e) {
  return !CONFIG.PERMITIDOS.length || CONFIG.PERMITIDOS.map(x => x.toLowerCase()).indexOf(String(e).toLowerCase()) >= 0;
}

// ------------------- rodar uma vez, pelo editor ---------------------
/** 1º: autoriza o envio e manda um e-mail de teste para você. */
function testarEnvio() {
  enviar(Session.getActiveUser().getEmail(), 'Teste do Agendamento Acadêmico', '<p>Funcionou! O envio de e-mails está autorizado.</p>');
}
/** 2º: instala o lembrete automático diário (substitui um anterior, se houver). */
function instalarLembreteDiario() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'lembreteAutomatico').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('lembreteAutomatico').timeBased().everyDays(1).atHour(CONFIG.HORA_LEMBRETE).inTimezone(CONFIG.FUSO).create();
}
/** Executado pelo gatilho diário. */
function lembreteAutomatico() { enviarLembretesDoDia(false); }
