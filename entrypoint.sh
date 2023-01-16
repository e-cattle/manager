#!/bin/sh
ROOT_DIR=/usr/share/nginx/html
# Script responsável por substituir variáveis de ambiente dentro do diretório 'dist'
# Substituindo variáveis env nos arquivos JavaScript
echo "Replacing env constants in JS"
for file in $ROOT_DIR/js/*.js*;
do
  echo "Processing $file ...";

  sed -i 's|VUE_APP_CLOUD_ARG|'${VUE_APP_CLOUD}'|g' $file 

done
# Iniciando Nginx
echo "Starting Nginx"
nginx -g 'daemon off;'