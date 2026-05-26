# MisGastos

Aplicación web para gestión de gastos personales desarrollada con Next.js, Prisma y PostgreSQL.

La app permite registrar gastos, categorizarlos, visualizar estadísticas mediante gráficos y exportar reportes en PDF.

---

## 🚀 Demo

https://mis-gastos-sable.vercel.app/

---

## 📦 Repositorio

https://github.com/Nicolasperlo29/MisGastos

---

## ✨ Funcionalidades

- Registro y edición de gastos
- Eliminación de gastos
- Categorías personalizadas
- Estadísticas y gráficos
- Filtros por fecha
- Exportación de gastos en PDF
- Autenticación de usuarios
- Protección de rutas
- Tema claro/oscuro

---

## 🛠 Tecnologías utilizadas

- Next.js
- React
- TypeScript
- Prisma
- PostgreSQL
- NextAuth
- Recharts
- Vercel

---

## ⚙️ Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Nicolasperlo29/MisGastos.git
```

### 2. Entrar al proyecto

```bash
cd MisGastos
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Crear un archivo `.env`:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

### 5. Ejecutar Prisma

```bash
npx prisma generate
npx prisma db push
```

### 6. Iniciar el proyecto

```bash
npm run dev
```

---

## 📚 Aprendizajes

Este proyecto fue desarrollado para seguir profundizando en:

- Desarrollo full stack
- Autenticación y protección de rutas
- Manejo de base de datos
- Deploy de aplicaciones
- Variables de entorno
- Integración frontend/backend

---

## 📄 Licencia

Proyecto desarrollado con fines educativos y de práctica.
