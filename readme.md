# Tanya Martelli Photography

## Descripción del Proyecto

Este proyecto es una aplicación web desarrollada para Tanya Martelli, una fotógrafa profesional, con el objetivo de elevar el nivel de exposición y organización de su negocio. La aplicación consta de dos partes principales:

1. Panel de administración con funcionalidades para gestionar el portafolio, facilitar el proceso de reserva y optimizar la comunicación efectiva con sus clientes.
2. Interfaz de usuario visualmente atractiva para captar la atención de los visitantes con el objetivo de convertirlos en clientes.

## Tecnologías Utilizadas

- **Frontend**: Vue.js
- **Backend**: Node.js con Express.js
- **Base de Datos**: MySQL

## Características Principales

- Gestión de portafolio y categorías de sesiones fotográficas
- Sistema de reserva de sesiones
- Comunicación directa con clientes
- Autenticación segura para el panel de administración
- Interfaz responsive y visualmente atractiva
- Formulario de contacto

## Web del proyecto

https://tanyamartelli.com

## WhatsApp Notifications

- Ejecuta `docker-compose up backend` (o `npm start` en `backend/`) y observa los logs del servicio.
- La primera vez verás en consola el mensaje `SCAN THE QR CODE...` seguido del código QR para vincular WhatsApp.
- Abre WhatsApp en tu móvil, ve a Dispositivos vinculados y escanea el QR para autorizar los envíos automáticos.
- La autenticación se almacena bajo `backend/.wwebjs_auth`, por lo que se conservará entre reinicios siempre que el volumen esté montado.
- Si el log muestra `The profile appears to be in use`, borra el archivo `backend/.wwebjs_auth/session-tanya-martelli-photo/Default/SingletonLock` antes de reiniciar el backend.

## Email Service

- El servicio de correo está deshabilitado por defecto para evitar los errores `ETIMEDOUT` de Gmail.
- Cuando dispongas de un proveedor SMTP alternativo, establece `EMAIL_ENABLED=true` y las credenciales necesarias en las variables de entorno antes de reiniciar el backend.
