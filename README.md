# WallaClone Frontend

Este es el frontend del proyecto WallaClone, una plataforma de compraventa de artículos de segunda mano.

## Configuración del entorno de desarrollo

1. Clona el repositorio:
git clone https://github.com/psychohub/wallaclone-front.git
cd wallaclone-front
   
2. Instala las dependencias:
npm install

3. Inicia el servidor de desarrollo:
npm start

4. Abre [http://localhost:3001](http://localhost:3001) para ver la aplicación en el navegador.

## Scripts disponibles

- `npm start`: Inicia el servidor de desarrollo.
- `npm test`: Ejecuta las pruebas.
- `npm run build`: Construye la aplicación para producción.
- `npm run lint`: Ejecuta el linter para verificar el estilo del código.
- `npm run lint:fix`: Corrige automáticamente los problemas de estilo que puede solucionar.

## Estructura del proyecto
src/
components/  # Componentes reutilizables
pages/       # Componentes de página
services/    # Servicios para API y lógica de negocio
styles/      # Estilos globales y temas
utils/       # Funciones de utilidad

## Contribución al Proyecto

Para contribuir a este proyecto, sigue estos pasos:

1. Crea una nueva rama desde 'develop' con un nombre descriptivo (ej. `feature/nueva-funcionalidad` o `bugfix/correccion-error`).

2. Realiza tus cambios en esta rama.

3. Haz commit de tus cambios con mensajes claros y descriptivos.

4. Haz push de tu rama al repositorio.

5. Crea un Pull Request (PR) para fusionar tu rama en 'develop'.

6. Espera la revisión de código. Puede que se te pida realizar cambios.

7. Una vez aprobado, tu PR será fusionado en 'develop'.

Notas importantes:
- No hagas push directamente a las ramas 'main' o 'develop'.
- Asegúrate de que tu código pase todas las pruebas antes de crear un PR.
- Mantén tus PRs lo más pequeños y enfocados posible para facilitar la revisión.
