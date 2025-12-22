#!/bin/bash

# Script de actualización para SistBienes Frontend
# Uso: ./update.sh

set -e  # Detener en caso de error

echo "🔄 Actualizando SistBienes Frontend..."
echo "======================================"

# Navegar al directorio del frontend
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. ¿Estás en el directorio correcto?"
    exit 1
fi

# Guardar cambios locales (si los hay)
if [ -n "$(git status --porcelain)" ]; then
    echo "💾 Guardando cambios locales..."
    git stash
    STASHED=true
else
    STASHED=false
fi

# Obtener últimos cambios
echo "📥 Obteniendo últimos cambios del repositorio..."
git pull origin main || git pull origin master

# Restaurar cambios locales si se guardaron
if [ "$STASHED" = true ]; then
    echo "♻️  Restaurando cambios locales..."
    git stash pop
fi

# Instalar/actualizar dependencias
echo "📦 Instalando dependencias..."
npm install --force

# Compilar el proyecto
echo "🔨 Compilando proyecto para producción..."
npm run build

# Verificar que la compilación fue exitosa
if [ ! -d "dist" ]; then
    echo "❌ Error: La compilación falló. No se encontró el directorio dist/"
    exit 1
fi

# Recargar Nginx
echo "🔄 Recargando Nginx..."
sudo systemctl reload nginx

# Verificar estado de Nginx
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx está funcionando correctamente"
else
    echo "❌ Error: Nginx no está funcionando"
    exit 1
fi

echo ""
echo "✅ Frontend actualizado correctamente"
echo ""
echo "🌐 El sitio web ya está disponible con los últimos cambios"
