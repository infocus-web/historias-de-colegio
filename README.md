# Infocus — Fotos de Colegios (prototipo funcional)

Plataforma para que las familias accedan a las fotos de su colegio, las elijan con marca de
agua, paguen y reciban las 3 fotos del kit en HD.

## Qué es real hoy

- Base de datos real en Supabase (colegios, eventos, familias, alumnos, fotos, pedidos).
- Flujo completo navegable: selector de colegio → alta de familia (nombre + WhatsApp) →
  galería con marca de agua → selección de 1 foto grupal + 1 individual + 1 con docente →
  elección de kit → creación del pedido.
- Hay un colegio y evento de demostración (`colegio-demo`) con 3 fotos de ejemplo cargadas.

## Qué falta para que sea 100% real

1. **Mercado Pago**: el endpoint `/api/mercadopago/crear-preferencia` ya está escrito para
   crear una preferencia real de Checkout Pro. Falta cargar `MERCADOPAGO_ACCESS_TOKEN` como
   variable de entorno en Vercel (con el Access Token de la cuenta de Mercado Pago de
   Infocus). Mientras no esté, la web usa un botón de "Simular pago aprobado" para poder
   probar el resto del flujo.
2. **Envío por WhatsApp**: falta conectar una WhatsApp Business API (por Meta Cloud API o un
   proveedor como Twilio) para enviar automáticamente el link de descarga de las 3 fotos en
   HD cuando el pedido pasa a "pagado". Es un trámite del lado de Meta/el proveedor
   (verificación del negocio) que tiene que iniciar Infocus.
3. **Multi-colegio con alta propia**: la base ya soporta múltiples colegios; falta un panel
   de administración para que Infocus cargue colegios y eventos nuevos sin tocar la base a mano.
4. **Panel para confirmar efectivo recibido**: un pedido pagado en efectivo queda "pendiente"
   indefinidamente hasta que alguien edite la base a mano; falta un panel simple para marcarlo
   recibido.

## Panel interno de fotos (`/admin`)

Ya está: un panel protegido por contraseña donde el fotógrafo sube las fotos de cada evento
(bulk upload directo al bucket de Storage `fotos`) y las asigna — individuales y "con
docente" a un alumno puntual, grupales a un grado + división (una sola foto por curso, la
ven todas las familias de ese curso). Mientras un evento no tenga ninguna foto asignada, la
galería de la familia sigue mostrando todas las fotos de esa categoría sin filtrar (así el
evento demo no se rompe); en cuanto se asigna la primera foto de una categoría, el filtrado
por alumno/curso se activa automáticamente para ese evento.

Login: una sola contraseña compartida (no hay usuarios ni roles), definida por la variable de
entorno `ADMIN_PASSWORD`.

## Variables de entorno (Vercel)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `MERCADOPAGO_ACCESS_TOKEN` (pendiente)
- `ADMIN_PASSWORD` (pendiente) — contraseña del panel interno `/admin`. Configurarla en
  Vercel → Project Settings → Environment Variables (no hay forma de setearla de forma
  remota, hay que cargarla ahí a mano).
