# WallaClone Frontend

WallaClone es una plataforma de compraventa de artículos de segunda mano. Este repositorio contiene el código del frontend del proyecto, que se ha migrado a Vite para mejorar el rendimiento y la experiencia de desarrollo.

## Tecnologías Utilizadas

- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **Redux**: Librería para el manejo del estado global de la aplicación.
- **Redux Toolkit**: Conjunto de herramientas oficiales para un desarrollo eficiente con Redux.
- **React Router DOM**: Librería para el manejo de rutas en aplicaciones React.
- **Axios**: Cliente HTTP para realizar solicitudes al backend.
- **React-Bootstrap**: Componentes Bootstrap para React.
- **FontAwesome**: Iconos vectoriales para mejorar la UI.
- **Vite**: Herramienta de construcción rápida y ligera para proyectos web modernos.

## Configuración del Entorno de Desarrollo

1. Clona el repositorio:

    ```bash
    git clone https://github.com/psychohub/wallaclone-front.git
    cd wallaclone-front
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

3. Inicia el servidor de desarrollo:

    ```bash
    npm run dev
    ```

4. Abre [http://localhost:3001](http://localhost:3001) para ver la aplicación en el navegador.

## Comunicación con el Backend

El frontend se comunica con el backend a través de Axios. La configuración de Axios se realiza en el archivo `src/axiosConfig.ts` para establecer la URL base de las solicitudes API. Asegúrate de que el backend esté corriendo en `http://localhost:3000` para que las solicitudes funcionen correctamente.

```typescript
// src/axiosConfig.ts
import axios from 'axios';




const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

export default axiosInstance;

## Listado de Anuncios con Paginación

El componente `AdList` permite listar los anuncios con soporte de paginación. La lógica de paginación se implementa utilizando `ReactPaginate` y Axios para las solicitudes API. Los anuncios se cargan y se muestran en páginas con un límite de 12 anuncios por página.

### Características del Listado de Anuncios

- **Nombre**: Muestra el nombre del anuncio.
- **Imagen**: Muestra una imagen del anuncio.
- **Descripción**: Muestra una breve descripción del anuncio.
- **Tipo de Anuncio**: Indica si el anuncio es de venta o búsqueda.
- **Precio**: Muestra el precio del artículo.
- **Autor**: Muestra el nombre del autor del anuncio.
- **Tags**: Muestra las etiquetas asociadas al anuncio.
- **Paginación**: Permite navegar entre las páginas de anuncios.

### Manejo de Estados

- **Cargando Anuncios**: Mientras los anuncios se están cargando, se muestra un componente de carga (loader).
- **Error al Cargar Anuncios**: Si ocurre un error durante la carga de los anuncios, se muestra un mensaje de error.
- **Anuncios Disponibles**: Si hay anuncios disponibles, se muestran en una lista. Si no hay anuncios, se muestra un mensaje indicando que no hay anuncios disponibles.

### Componente Loader

Se ha implementado un componente `Loader` para mostrar una animación de carga mientras se están cargando los anuncios. Esto mejora la experiencia de usuario al proporcionar una retroalimentación visual durante la espera.


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