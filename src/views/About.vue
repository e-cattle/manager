<template>
  <v-app light>
    <v-container>
        <v-layout row wrap>
          <v-flex>
            <p class="left">
              <v-img src="../assets/logo.png" height="120" contain alt="Logo do e-Cattle" />
            </p>
          </v-flex>
          <v-flex>
            <p>
              A aplicação Sistema de Gestão de Inquilinos do e-Cattle permite o cadastro de propriedades
              rurais que terão os dados do BigBoxx sincronizados na nuvem, assim como os gestores dessas propriedades.
              sistema possui três papéis para os gestores, sendo eles:
              <ul>
                <li><strong>Viewer</strong>: é o papel com menor permissão no sistema, o usuário está habilitado somente a visualização dos dados da propriedade que estão sincronizados na nuvem.</li>
                <li><strong>Manager</strong>: possui permissão maior em relação ao <strong><em>viewer</em></strong>, podendo ativar middlewares e vincular outros usuários de mesmo papel à propriedade.</li>
                <li><strong>Owner</strong>: possui maior permissão entre os três papéis, além das permissões de <strong><em>manager</em></strong> também está apto ao vínculo de usuários de qualquer papel à propriedade.</li>
              </ul>
            </p>
            <p>O sistema faz parte da plataforma <abbr title="Internet das Coisas">IoT</abbr> e-Cattle, portanto,
            seus códigos são disponibilizados através da licença BSD.</p>
            <ul>
              <li><a href="https://e-cattle.github.io/">Documentação da plataforma e-Cattle</a>;</li>
              <li><a href="https://github.com/e-cattle/manager">Repositório da aplicação Sistema de Gestão de Inquilinos</a>;</li>
            </ul>
          </v-flex>
        </v-layout>
    </v-container>
  </v-app>
</template>
