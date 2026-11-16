/* agendamento/config.js | Envio de e-mails e banco de dados (opcional).
   Deixe EMAIL_API vazio e o site funciona normalmente, sem enviar e-mails.
   Para ativar, siga integracoes/gmail/LEIA-ME.md e cole aqui:
   - EMAIL_API: a URL do "App da Web" do Google Apps Script (termina em /exec)
   - EMAIL_TOKEN: a mesma senha definida em CONFIG.TOKEN no Code.gs
   - DB_API: mesma URL do EMAIL_API (para usar a planilha como banco de dados)
   - DB_TOKEN: mesma senha do EMAIL_TOKEN                        */
window.CFG = {
  EMAIL_API: 'https://script.google.com/macros/s/AKfycbwWgVOBoVdIGhP67465CemigzNv1JjUWRCC-1AI6wI2lNtrTk0J5xAa1jSOo-y3Q7oZ/exec',
  EMAIL_TOKEN: 'agenda2026',
  DB_API: 'https://script.google.com/macros/s/AKfycbwWgVOBoVdIGhP67465CemigzNv1JjUWRCC-1AI6wI2lNtrTk0J5xAa1jSOo-y3Q7oZ/exec',
  DB_TOKEN: 'agenda2026'
};
