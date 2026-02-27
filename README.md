# Gestor de Opiniones

## ¿De qué trata?

Es una aplicación de backend donde los usuarios pueden registrarse, iniciar sesión, escribir publicaciones sobre cualquier tema y dejar comentarios en las publicaciones de otros. La idea principal es tener un espacio donde cada quien pueda expresar su opinión y interactuar con los demás.

## ¿Cómo funciona?

Para empezar a usar la aplicación, primero hay que crear una cuenta ingresando un nombre, un nombre de usuario, un correo y una contraseña. Una vez registrado, se puede iniciar sesión con el correo o el nombre de usuario, y la aplicación dará acceso a todas las funciones.

Cada usuario tiene un perfil personal donde puede ver y editar su información, como el nombre, una pequeña descripción y una foto. También puede cambiar su contraseña cuando lo necesite. Lo único que no está permitido es eliminar la cuenta.

Dentro de la aplicación, los usuarios pueden crear publicaciones con un título, una categoría y el contenido que quieran compartir. Pueden editar o eliminar sus propias publicaciones, pero no pueden modificar las de otros usuarios. También pueden dejar comentarios en cualquier publicación, y de igual forma, solo pueden editar o borrar sus propios comentarios.

## Tecnologías usadas

- Node.js — para la lógica del servidor
- Express — para manejar las rutas y peticiones
- MongoDB — para guardar toda la información
- JSON Web Tokens (JWT) — para verificar la identidad de cada usuario
- Bcrypt — para proteger las contraseñas
