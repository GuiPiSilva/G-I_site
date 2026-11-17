# Configuração do Briefing da G&I

O formulário público fica em `/briefing/` e o painel administrativo em `/admin/briefings/`.

## 1. Banco de dados

O backend utiliza PostgreSQL via conexão privada do servidor (pacote `pg`). Pode ser usado o banco Neon já utilizado pela G&I, desde que a conexão tenha permissão para criar tabela e inserir/consultar dados.

Execute uma única vez o conteúdo de `database/briefings.sql` no banco escolhido. A tabela criada é `public.gi_site_briefings`.

Não exponha a URL de conexão no navegador e não conceda permissões públicas/anon à tabela. A aplicação acessa a tabela exclusivamente pelas funções de servidor da Vercel.

## 2. Variáveis de ambiente da Vercel

No projeto `agenciagi`, em Settings → Environment Variables, configure para Production (e Preview, se desejar testar):

- `DATABASE_URL`: URL de conexão PostgreSQL do banco, preferencialmente a URL pooled fornecida pelo Neon.
- `BRIEFING_ADMIN_PASSWORD`: senha forte escolhida para entrar no painel.
- `BRIEFING_SESSION_SECRET`: segredo aleatório longo, com pelo menos 32 bytes. Gere um valor exclusivo e não reutilize senhas.

Depois de salvar as variáveis, faça um novo deploy de produção para que as funções recebam a configuração.

## 3. Endereços

- Público: https://giagencia.com.br/briefing/
- Administrativo: https://giagencia.com.br/admin/briefings/

O painel exige a senha administrativa e mantém a sessão em cookie HttpOnly, Secure e SameSite=Strict. As páginas administrativas recebem instrução para não serem indexadas.

## 4. Teste recomendado

1. Abra o formulário público e envie um briefing de teste.
2. Entre no painel administrativo.
3. Confirme que o registro aparece na lista e abra seus detalhes.
4. Altere o status e atualize a página para verificar a persistência.

## Observações

O formulário não envia os dados para WhatsApp nem armazena respostas no navegador. As respostas são gravadas no PostgreSQL no servidor. A configuração das variáveis de ambiente e a execução do SQL são necessárias antes de receber briefings reais.
