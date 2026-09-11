# Lestar Henriques — Premium Escuro · v3.2.1

Portfólio estático em HTML, CSS e JavaScript. O pacote já contém a página gerada, imagens locais e SVGs. Não exige Docker, banco de dados, instalação de pacotes npm nem uma chave de API.

## Abrir no Windows

Extraia o ZIP na raiz de `E:\`. A pasta resultante é `E:\Portfolio_Lestar_Premium_v3_2_1`.

Execute `INICIAR_LOCAL.bat` com dois cliques ou pelo PowerShell:

```powershell
cd "E:\Portfolio_Lestar_Premium_v3_2_1"
.\INICIAR_LOCAL.bat
```

O inicializador utiliza **Node.js 20 ou superior** e abre `http://127.0.0.1:4177/`.
Mantenha o terminal aberto. Para encerrar o servidor, pressione `Ctrl+C`.
A porta 4177 separa esta revisão dos testes anteriores em 4173, 4174 e 4175.

A revisão **v3.2.1** aparece no terminal e no rodapé da página. Ao comparar versões, confira também a pasta de onde o servidor foi iniciado.

Caso a porta esteja ocupada, não é necessário encerrar outros projetos. Dentro desta pasta, use outra porta:

```powershell
$env:PORT = "4178"
node .\scripts\serve.mjs --open
```

O `index.html` também pode ser aberto diretamente após a extração, mas o servidor local é preferível para testar links de cases, histórico do navegador e a cópia de endereço.

## Ajustes desta entrega

- Ferramentas apresentadas como **ícone branco + nome**, sem cápsulas, bordas, fundo colorido ou comportamento de botão. Java e JavaScript usam silhuetas distintas.
- SVGs locais do Devicon e do Simple Icons. O monograma JavaScript é apresentado sem o campo quadrado de fundo. As fontes e alterações estão em `data/icon-sources.json`.
- Os símbolos de LinkedIn e GitHub preservam a geometria branca usada na v3.1.0. Os links ficam sem moldura, com os mesmos destinos.
- Cinco pontos decorativos alternam **um único ícone no mesmo espaço**: marca, assinatura da abertura, manifesto, canto da foto e contato. Não existe faixa horizontal dentro da foto.
- A faixa grande de tecnologias continua animada, com o SVG de cada ferramenta no lugar dos antigos símbolos de asterisco.
- Vitrine inicial novamente inclinada, com etiquetas flutuantes, movimento sutil ao ponteiro e avanço automático. Nenhum botão de pausa foi reintroduzido.
- Foto sem filtro, sem alteração de cor no hover e sem inclinação pelo mouse.
- Imagens dos cases em quadro limitado, sem ampliação automática além da resolução original. A ampliação continua disponível separadamente.
- O mapa de tecnologias mantém quatro controles próprios por teclado ou clique, com descrição curta e animação de conexão. A lista “Na minha caixa de ferramentas” é somente informativa.

## Catálogo

Há **14 projetos**, sendo **10 dashboards e quatro aplicações**. Títulos, descrições e links dos projetos mantidos foram preservados.

Foram retirados dos dados publicados, HTML e destaques: Hefesto Distribuição, Resultados Copa Energia, Resultados Boticário, Painel Gerencial Santander, Painel Operacional Santander, Painel Gerencial Zurich e Painel Individual Zurich. Suas mídias exclusivas também foram removidas; não há vídeo do Hefesto no pacote.

**COPA - Tempos** e **Carteirização Boticário** continuam no portfólio: são projetos diferentes dos excluídos.

## Edição sem perder as correções

- `data/projects.json`: catálogo e informações dos cases.
- `data/experience.json`: seleção e ordem dos cinco destaques.
- `data/site.json`: dados do autor e contatos.
- `src/index.template.html`: estrutura de origem da página.
- `styles.css`: visual e animações.
- `scripts/tools.js`: alternância de ícones e comentários do mapa.
- `scripts/experience.js`: efeitos, rolagem e perspectiva da vitrine.
- `script.js`: catálogo, cases, menu, contatos e carrossel.
- `assets/icons/`: SVGs monocromáticos e aviso de licença.

Após editar os dados ou o template, execute:

```powershell
npm run build
```

O comando atualiza `index.html` e produz `dist/`. As remoções e os ícones estão na origem do build; gerar novamente não recupera o catálogo antigo nem os botões das ferramentas. Para revisar apenas o HTML sem criar `dist/`: `node scripts/build.mjs --html-only`.

## Testes

Os testes de conteúdo e funções usam somente o Node instalado:

```powershell
npm test
```

Os testes opcionais de interface utilizam Python e Playwright. Consulte `tests/browser/README.md`. Esses componentes **não são necessários para executar o site**.

O escopo de verificação desta entrega está em `docs/VERIFICACAO.md`. Os resultados brutos estão em `docs/verification/`.

## Publicação

`vercel.json` usa `npm run build` e a pasta `dist/`. Nenhuma alteração é enviada automaticamente ao GitHub ou à Vercel pelo inicializador local.

Os links de dashboards corporativos mantêm as permissões do serviço de destino. O servidor local não altera essas permissões. As imagens e os ícones do portfólio são locais; o carregamento opcional da fonte Inter pelo Google Fonts depende de internet, com fonte alternativa do sistema quando indisponível.

## Marcas e créditos

Os ícones servem para identificar ferramentas. As marcas pertencem aos respectivos titulares e não indicam endosso. Fontes, versões e modificações estão em `data/icon-sources.json`; licença MIT do Devicon em `assets/icons/DEVICON-LICENSE.txt`. Ícones do Simple Icons foram obtidos da versão 13.21.0, distribuída sob CC0-1.0. Nenhum arquivo de fonte tipográfica acompanha este pacote.
