# Languages
## [ES](#es)
## [EN](#en)

# [LotteryFornt.io](#lotteryforntio)
Este proyecto es una aplicación de frontend desarrollada en Angular que gestiona un sistema de sorteos de lotería. El sistema incluye un robusto control de acceso basado en roles (RBAC) implementado a través de interceptores y directivas personalizadas, garantizando la seguridad y la correcta autorización de los usuarios en diferentes secciones de la aplicación.

## [Características Principales](#caracteristicas-principales)

### [Generación de Sorteos](#generacion-de-sorteos)
Los usuarios con los permisos adecuados pueden crear nuevos sorteos, configurando detalles como la fecha y las reglas del sorteo.

### [Venta de Tickets](#venta-de-tickets)
Los usuarios pueden comprar tickets para los sorteos disponibles. Cada ticket está vinculado a un usuario específico, lo que permite un seguimiento detallado de las participaciones.

### [Generación de Números de Ticket](#generacion-de-numeros-de-ticket)
Los números en los boletos pueden ser generados automáticamente o ingresados manualmente por el usuario, proporcionando flexibilidad y personalización en la compra de tickets.

### [Generación de Número Ganador](#generacion-de-numero-ganador)
El número ganador se determina aleatoriamente en cada sorteo, asegurando un proceso justo y transparente.

### [Control de Acceso y Autorización](#control-de-acceso-y-autorizacion)
La aplicación utiliza interceptores para gestionar la autorización y asegurar que los usuarios solo puedan acceder a las funcionalidades para las que tienen permiso. Además, las directivas personalizadas facilitan la gestión del acceso basado en roles en la interfaz de usuario.

### [Cifrado Sincrónico Bidireccional](#cifrado-sincronico-bidireccional)
La seguridad de la comunicación entre el frontend y el backend está garantizada mediante cifrado sincrónico bidireccional. El frontend encripta las solicitudes antes de enviarlas al backend, que las desencripta, procesa y luego cifra las respuestas. El frontend descifra las respuestas para presentarlas al usuario, asegurando la protección de los datos en tránsito.

## [Authors](#authors)

- [@Devil-bit123](https://github.com/Devil-bit123)
