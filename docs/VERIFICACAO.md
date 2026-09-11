# Verificação — Portfolio Lestar Premium v3.2.1

## Resultado da execução

| Camada | Resultado |
|---|---|
| Testes Node de conteúdo, catálogo e regras | 27 de 27 aprovados |
| Verificações da interface no Chromium | 131 de 131 aprovadas |
| Verificações HTTP contra servidor Node real | 78 de 78 aprovadas |
| Build | Concluído, com 14 projetos |
| Reconstrução do HTML | Idempotente: bytes iguais antes e depois do build |
| Imagens e recursos originais mantidos | 43 arquivos comparados, bytes preservados |
| Fontes tipográficas e vídeos no pacote | Nenhum arquivo de fonte nem vídeo incluído |

## Pontos conferidos

A caixa de ferramentas é uma lista sem botões, links ou elementos focáveis. Cada item tem ícone SVG branco e nome, sem fundo, borda, sombra ou cantos arredondados. Java e JavaScript têm geometrias distintas. As seis ferramentas usam arquivos locais em `assets/icons/`.

As cinco posições decorativas trocam somente um ícone por vez, sem alterar a dimensão de seu espaço. O canto da foto conserva 34 × 34 pixels. A troca utiliza uma transição no SVG interno, não no tamanho do recipiente. A faixa grande mantém os SVGs associados a seus nomes, sem os símbolos de asterisco.

LinkedIn e GitHub preservam as silhuetas brancas da v3.1.0 e os destinos anteriores. O teste de origem confere os caminhos SVG. O botão de copiar foi verificado geometricamente no centro do controle e o clique produz feedback; esta verificação não representa leitura da área de transferência do Windows do usuário.

A vitrine inicial está inclinada, contém as etiquetas flutuantes e carrega os cinco projetos selecionados. Foi verificada sua troca automática mesmo com hover e foco. Quadros consecutivos do fundo animado foram comparados. O retrato mantém filtro e transformação como `none` ao receber o ponteiro.

Os 14 cases abrem, suas imagens carregam e são mostradas sem ultrapassar a resolução original e o limite de altura de 360 pixels no desktop testado. O case COPA - Tempos também foi aberto em ampliação separada. O catálogo não contém os sete projetos removidos; a mídia do Hefesto e a imagem Resultados Copa Energia retornam 404 no servidor.

O mapa de tecnologias responde ao clique e ao teclado, com explicações curtas. Busca, filtros, estado vazio, carregamento de mais projetos e menu móvel foram exercitados.

## Responsividade

A interface foi conferida nas larguras 320, 390, 600, 768, 960, 1100, 1366, 1600, 1920 e 2560 pixels. Os controles do cabeçalho não se sobrepuseram e não houve rolagem horizontal nessas execuções. As listas sem molduras couberam na área visível.

## Limites da execução

Os arquivos HTML, CSS e JavaScript reais foram renderizados no Chromium em memória, usando o helper incluído. Isso não é uma navegação ponta a ponta pelo endereço local do servidor. O ambiente de preparação restringe a navegação do navegador por URL; por esse motivo, os recursos HTTP foram verificados separadamente, comparando seus bytes com os arquivos publicados. A fonte externa foi omitida na renderização do teste, usando a fonte alternativa do sistema.

Não foi testado o arquivo `.bat` em uma instalação real do Windows. O script contém as verificações de versão do Node, o caminho relativo do projeto e a porta 4177. Links corporativos externos, permissões de dashboards, sua instalação local e a publicação na Vercel não foram modificados nem validados por esta execução.

## Evidências e reprodução

Os resultados detalhados e hashes dos arquivos verificados estão em `docs/verification/`. Os testes ficam em `tests/`. A execução inicial dos sete testes novos falhou na base anterior; o registro está em `docs/verification/red.log`. O pacote final também foi extraído novamente e os testes Node executados sobre essa cópia antes da entrega.

```text
npm test
npm run build
python tests/browser/test_revision.py
python tests/check_http.py
```

Os dois comandos Python são opcionais e exigem as ferramentas de teste documentadas. Rodar o site não depende deles.
