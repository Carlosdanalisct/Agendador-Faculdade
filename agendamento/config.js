/* agendamento/config.js | Envio de e-mails pelo Gmail (opcional).
   Deixe EMAIL_API vazio e o site funciona normalmente, sem enviar e-mails.
   Para ativar, siga integracoes/gmail/LEIA-ME.md e cole aqui:
   - EMAIL_API: a URL do "App da Web" do Google Apps Script (termina em /exec)
   - EMAIL_TOKEN: a mesma senha definida em CONFIG.TOKEN no Code.gs        */
window.CFG = {
  EMAIL_API: '',
  EMAIL_TOKEN: 'troque-esta-senha'
};
