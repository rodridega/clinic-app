# 🚀 Guía de Deployment en GitHub Pages

## 📋 Pasos para Deployar

### 1. Crear repositorio en GitHub

1. Ve a [github.com](https://github.com) y crea un nuevo repositorio
2. Nómbralo `clinic-app` (o el nombre que prefieras)
3. **NO** inicialices con README, .gitignore o licencia (ya los tenemos)

### 2. Inicializar Git localmente

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Clinic App"

# Agregar el remote (reemplaza TU-USUARIO con tu username de GitHub)
git remote add origin https://github.com/TU-USUARIO/clinic-app.git

# Cambiar a la rama main
git branch -M main

# Push inicial
git push -u origin main
```

### 3. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona:
   - Source: **GitHub Actions**
5. Guarda los cambios

### 4. Activar el Workflow

El workflow ya está configurado en `.github/workflows/deploy.yml` y se ejecutará automáticamente cada vez que hagas push a la rama `main`.

**Verificar el deployment:**
1. Ve a la pestaña **Actions** en tu repositorio
2. Verás el workflow "Deploy to GitHub Pages" ejecutándose
3. Cuando termine (check verde ✓), tu app estará live!

### 5. Acceder a tu App

Tu app estará disponible en:
```
https://TU-USUARIO.github.io/clinic-app/
```

## 🔄 Actualizaciones Futuras

Cada vez que quieras actualizar la app:

```bash
# Hacer cambios en el código

# Agregar cambios
git add .

# Commit
git commit -m "Descripción de los cambios"

# Push
git push
```

El deployment se hará automáticamente! 🎉

## ⚙️ Variables de Entorno

Si necesitas usar OpenRouter (API key):

1. Ve a **Settings** > **Secrets and variables** > **Actions**
2. Click en **New repository secret**
3. Nombre: `VITE_OPENROUTER_API_KEY`
4. Valor: Tu API key de OpenRouter
5. Click en **Add secret**

Luego actualiza el workflow para usar el secret:
```yaml
- name: Build
  run: npm run build
  env:
    VITE_OPENROUTER_API_KEY: ${{ secrets.VITE_OPENROUTER_API_KEY }}
```

## 🐛 Solución de Problemas

### Error: Base path incorrecta

Si las rutas no funcionan, asegúrate que en `vite.config.ts`:
```typescript
base: '/clinic-app/',  // Debe coincidir con el nombre de tu repo
```

### Error: Workflow no se ejecuta

1. Verifica que el archivo esté en `.github/workflows/deploy.yml`
2. Asegúrate de tener permisos en Settings > Actions > General
3. Activa "Allow all actions and reusable workflows"

### La app muestra pantalla blanca

1. Abre las DevTools del navegador (F12)
2. Mira los errores en Console
3. Probablemente sea un problema con la base path
4. Verifica que `base` en `vite.config.ts` sea correcto

## 📱 Testing Local

Para probar cómo se verá en producción:

```bash
npm run build
npm run preview
```

Esto te mostrará la versión de producción en `http://localhost:4173`

---

**¡Listo! Tu aplicación estará disponible online para cualquier profesional de la salud. 🏥💚**
