# Verificação de interface · v3.2.1

Executar o site não depende destes testes. Para rodar a verificação opcional, use Python com Playwright e um Chromium instalado. O script procura `chromium` ou `google-chrome` no PATH; a variável `PORTFOLIO_BROWSER` também pode apontar para o executável. Sem essa variável ou um navegador encontrado, o Playwright usa o navegador instalado por sua própria ferramenta.

```text
python tests/browser/test_revision.py
```

## Escopo e limites

`browser_helper.py` carrega os arquivos HTML/CSS/JS reais do pacote em uma página em memória. Imagens locais são convertidas em data URIs somente no teste; não são alteradas na aplicação. SVGs já estão embutidos no HTML pelo build. A fonte externa é omitida na renderização de teste, usando a fonte alternativa do sistema.

Esse modo foi utilizado porque o Chromium do ambiente de preparação restringe a navegação por URL. Os testes não constituem uma sessão completa no servidor HTTP. O servidor Node é verificado separadamente com requisições HTTP reais e comparação de bytes dos recursos.

O teste injeta uma implementação mínima de localStorage no contexto opaco `about:blank`. O site não utiliza localStorage para escolher ou desativar animações. Não são substituídos os manipuladores de eventos, o catálogo, as funções de renderização ou o CSS da página.

A verificação cobre as listas sem botões, preenchimentos brancos, alternadores compactos, carrossel contínuo, imagem da vitrine, busca e filtros, os 14 cases, dimensionamento das imagens, cópia com feedback, símbolos e links sociais, retrato e tamanhos responsivos. Os contatos externos não são acionados e suas permissões não são verificadas.

As capturas de tela são evidências estáticas, não uma gravação de todas as animações.
