# Languages

## [EN](#EN)

# ES
## LotteryFornt.io
Este proyecto es una aplicación de frontend desarrollada en Angular que gestiona un sistema de sorteos de lotería. El sistema incluye un robusto control de acceso basado en roles (RBAC) implementado a través de interceptores y directivas personalizadas, garantizando la seguridad y la correcta autorización de los usuarios en diferentes secciones de la aplicación.

## Características Principales

### Generación de Sorteos
Los usuarios con los permisos adecuados pueden crear nuevos sorteos, configurando detalles como la fecha y las reglas del sorteo.

### Venta de Tickets
Los usuarios pueden comprar tickets para los sorteos disponibles. Cada ticket está vinculado a un usuario específico, lo que permite un seguimiento detallado de las participaciones.

### Generación de Números de Ticket
Los números en los boletos pueden ser generados automáticamente o ingresados manualmente por el usuario, proporcionando flexibilidad y personalización en la compra de tickets.

### Generación de Número Ganador
El número ganador se determina aleatoriamente en cada sorteo, asegurando un proceso justo y transparente.

### Control de Acceso y Autorización
La aplicación utiliza interceptores para gestionar la autorización y asegurar que los usuarios solo puedan acceder a las funcionalidades para las que tienen permiso. Además, las directivas personalizadas facilitan la gestión del acceso basado en roles en la interfaz de usuario.

### Cifrado Sincrónico Bidireccional
La seguridad de la comunicación entre el frontend y el backend está garantizada mediante cifrado sincrónico bidireccional. El frontend encripta las solicitudes antes de enviarlas al backend, que las desencripta, procesa y luego cifra las respuestas. El frontend descifra las respuestas para presentarlas al usuario, asegurando la protección de los datos en tránsito.

## Authors

- [@Devil-bit123](https://github.com/Devil-bit123)

# EN
## LotteryFornt.io
This project is a frontend application developed in Angular that manages a lottery draw system. The system includes a robust Role-Based Access Control (RBAC) implemented through interceptors and custom directives, ensuring the security and proper authorization of users in different sections of the application.

## Main Features

### Draw Generation
Users with the appropriate permissions can create new draws, configuring details such as the date and rules of the draw.

### Ticket Sales
Users can buy tickets for available draws. Each ticket is linked to a specific user, allowing for detailed tracking of participations.

### Ticket Number Generation
Numbers on tickets can be generated automatically or entered manually by the user, providing flexibility and customization in ticket purchases.

### Winning Number Generation
The winning number is randomly determined in each draw, ensuring a fair and transparent process.

### Access Control and Authorization
The application uses interceptors to manage authorization and ensure that users can only access the functionalities for which they have permission. Additionally, custom directives facilitate role-based access management in the user interface.

### Bidirectional Synchronous Encryption
The security of communication between the frontend and backend is ensured through bidirectional synchronous encryption. The frontend encrypts requests before sending them to the backend, which decrypts, processes, and then encrypts the responses. The frontend decrypts the responses to present them to the user, ensuring data protection in transit.

## Authors

- [@Devil-bit123](https://github.com/Devil-bit123)
