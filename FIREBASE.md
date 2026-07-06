# Activar la nube (Firebase) para ver TODOS los resultados

Por defecto la plataforma guarda las notas **solo en el teléfono/PC de cada persona**.
Para que el **administrador vea todas las evaluaciones de todos los vendedores** desde
cualquier dispositivo, hay que activar Firebase Firestore una sola vez.

## Pasos (10–15 minutos, una sola vez)

1. Entra a **https://console.firebase.google.com** con tu cuenta de Google y pulsa
   **"Crear un proyecto"**. Ponle un nombre (por ejemplo `ccvd-capacitacion`).
   Puedes desactivar Google Analytics; no es necesario.

2. En el menú izquierdo entra a **Compilación → Firestore Database** y pulsa
   **"Crear base de datos"**. Elige **modo de producción** y la región
   `southamerica-east1` (o la que prefieras). Pulsa Habilitar.

3. Entra a la pestaña **Reglas** de Firestore, borra lo que haya y pega EXACTAMENTE
   esto, luego pulsa **Publicar**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /resultados_ccvd/{doc} {
         allow read: if true;      // cualquiera puede leer los resultados
         allow create: if true;    // cualquiera puede registrar una evaluación
         allow update, delete: if false;  // nadie puede modificar ni borrar (registro a prueba de manipulación)
       }
     }
   }
   ```

4. Vuelve al **inicio del proyecto**, pulsa el icono **`</>`** ("Agregar app web"),
   ponle un apodo (`ccvd`) y **Registrar app**. Firebase te mostrará un bloque
   `const firebaseConfig = { apiKey: "...", authDomain: "...", ... }`.
   Copia esos **6 valores**.

5. Abre `index.html`, busca el bloque `window.CCVD_FIREBASE = { ... }` (cerca del final)
   y reemplaza los `"TU_..."` por los 6 valores reales. Guarda.

6. Sube el cambio (commit + push). Listo: la app detecta las credenciales y a partir de
   ese momento cada evaluación se guarda en la nube.

## Cómo se ve

- Al entrar como **admin** a **📊 Resultados**, el aviso dirá
  **"☁️ Conectado a la nube"** y verás las evaluaciones de **todos** los dispositivos.
- Cada vendedor sigue viendo su propio historial, aunque cambie de teléfono.
- Los datos son **a prueba de borrado**: nadie (ni el admin desde la app) puede
  eliminar registros; quedan como historial permanente. Para depurar, se hace desde
  la consola de Firebase.

## Notas

- Los datos guardados son solo: nombre, usuario, marca, modelo, correctas, nota, fecha.
  No hay información sensible.
- El plan gratuito **Spark** de Firebase alcanza de sobra para este uso.
- Si algún día quieres cerrar la lectura pública, se puede migrar a Firebase Auth;
  para una herramienta interna de capacitación, las reglas de arriba son suficientes.
