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

## Email Service

- El backend ahora envía correos a través de [Resend](https://resend.com/), que dispone de un plan gratuito ideal para formularios de contacto.
- En el `.env` del backend define:  
  `EMAIL_ENABLED=true`, `RESEND_API_KEY=tu_api_key`, `RESEND_FROM_EMAIL=remitente@tudominio.com` y opcionalmente `RESEND_FROM_NAME="Nombre remitente"`.
- Asegúrate de que el dominio/remitente estén verificados en Resend para evitar bloqueos. Si no defines `RESEND_FROM_EMAIL`, usará `EMAIL_USER` como respaldo.
- El endpoint `/api/email/test` permite verificar la entrega de correos y Telegram. Envía `{"email":"tu@correo.com","telegram":true}` para comprobar ambos canales.

## Telegram Notifications

- Se añadió un canal de alertas vía Telegram para mensajes y reservas.
- Crea un bot con [@BotFather](https://t.me/BotFather), copia el token y obtén el ID del chat donde quieres recibir las notificaciones (por ejemplo con [@userinfobot](https://t.me/userinfobot) o añadiendo el bot a un grupo).
- Configura en el `.env` del backend: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` y (opcional) `TELEGRAM_THREAD_ID` si usas topics en grupos. Para deshabilitar este canal establece `TELEGRAM_ENABLED=false`.

## Anti-spam

- Las rutas de contacto y reservas aplican rate limiting (`6` envíos cada 10 minutos por IP) y enfriamiento adicional por correo para frenar envíos automatizados.
- Los mensajes se validan para evitar enlaces masivos, palabras clave sospechosas y textos excesivamente largos. Ajusta estos parámetros en `backend/app/controllers/message.controller.js` y `backend/app/controllers/booking.controller.js` según tus necesidades.
