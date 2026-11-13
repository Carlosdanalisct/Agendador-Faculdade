# Conformidade (17 diretrizes)

Situação do protótipo. **Não garante conformidade legal**: exige validação jurídica e de segurança.

| # | Diretriz | Situação |
|---|---|---|
| 1 | Política de privacidade | Página de demonstração (`priv`) |
| 2 | Termos de serviço | Página (`termos`) |
| 3 | Aviso de cookies | Banner com cookies essenciais; opcionais recusáveis |
| 4 | Política de reembolso | Página (`reemb`): não há cobrança |
| 5 | Formulários na LGPD | Finalidade informada e aceite explícito |
| 6 | Só dados necessários | Categoria, motivo e observações; login guarda só o nome; agendamentos de demonstração e a escolha de cookies ficam só no navegador |
| 7 | Scripts de tracking | Nenhum; fontes do sistema. Único recurso externo: React (cdnjs) |
| 8 | Acessibilidade | Rótulos, ARIA, estados que não dependem só de cor |
| 9 | Alt nas imagens | Sem imagens de conteúdo; elementos decorativos com `aria-hidden` |
| 10 | Contraste | Meta AA (4,5:1); validar com ferramenta WCAG |
| 11 | Navegação por teclado | Foco visível, link "Ir para o conteúdo", Enter ativa cartões |
| 12 | Sem avaliações falsas | Nenhuma avaliação ou depoimento |
| 13 | Sem promessas falsas | Nenhuma promessa de prazo ou desempenho |
| 14 | Copyright das imagens | Apenas recursos próprios; sem logo nem fotos da instituição |
| 15 | Dados da empresa | Rodapé com razão social, CNPJ, endereço e encarregado (**fictícios**) |
| 16 | Conformidade LGPD | Direitos do titular previstos; validação pendente |
| 17 | Riscos jurídicos | Revisão jurídica obrigatória antes de publicar |

## Pendências antes de uso real
- Trocar os dados fictícios do rodapé pelos reais.
- Revisar privacidade, termos e reembolso com um advogado.
- Hospedar o React localmente se quiser eliminar o CDN.
- Medir contraste e acessibilidade com ferramentas (ex.: Lighthouse, axe).
- Implementar autenticação e armazenamento seguros no servidor.
