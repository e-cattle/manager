<template>
  <v-app light>
    <v-data-table
    :headers="headers"
    :items="farms"
    sort-by="calories"
    class="elevation-1">
    <template v-slot:item.id="{ item }">
      <v-chip color="gray" dark label class="plain" small>{{ item.id }}</v-chip>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        class="mr-2"
        @click="editItem(item)"
      >
        edit
      </v-icon>
      <v-icon
        @click="deleteItem(item)"
      >
        delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      headers: [
        {
          text: 'Nome',
          align: 'left',
          value: 'name'
        },
        { text: 'Cidade', value: 'city' },
        { text: 'Estado', value: 'state' },
        { text: 'ID', value: 'id' },
        { text: 'Registro', value: 'created' },
        { text: 'Sincronia', value: 'synched' },
        { text: 'Ações', value: 'action', sortable: false }
      ],
      farms: [
        {
          id: '123',
          name: 'Santa Catarina',
          city: 'Campo Grande',
          state: 'MS',
          created: '12/8/81',
          synched: '29/1/20 13:34'
        }
      ]
    }
  }
}
</script>

<style scoped>
.plain {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bolder;
}
</style>
