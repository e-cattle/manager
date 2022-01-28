### Conteúdo
- [Sobre](#sobre)
- [Execução do projeto](#executando-o-projeto)

## Sobre
A aplicação Sistema de Gestão de Inquilinos do e-Cattle permite o cadastro de propriedades rurais que terão os dados do BigBoxx sincronizados na nuvem, assim como os gestores dessas propriedades. sistema possui três papéis para os gestores, sendo eles:
- **Viewer**: é o papel com menor permissão no sistema, o usuário está habilitado somente a visualização dos dados da propriedade que estão sincronizados na nuvem.
- **Manager**: possui permissão maior em relação ao *viewer*, podendo ativar middlewares e vincular outros usuários de mesmo papel à propriedade.
- **Owner**: possui maior permissão entre os três papéis, além das permissões de *manager* também está apto ao vínculo de usuários de qualquer papel à propriedade.

## Executando o projeto

  ### Project setup
  ```
  npm install
  ```

  ### Compiles and hot-reloads for development
  ```
  npm run serve
  ```

  ### Compiles and minifies for production
  ```
  npm run build
  ```

  ### Lints and fixes files
  ```
  npm run lint
  ```

  ### Customize configuration
  See [Configuration Reference](https://cli.vuejs.org/config/).
