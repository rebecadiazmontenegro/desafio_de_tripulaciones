FROM node:20

# Directorio de trabajo
WORKDIR /app

# Copia todo el proyecto
COPY . .

# Instalar dependencias del backend
RUN npm install --prefix backend

# Instalar dependencias del frontend
RUN npm install --prefix frontend

# Construir frontend
RUN npm run build --prefix frontend

# Configuración de producción
ENV NODE_ENV=production
EXPOSE 3000

# Comando para iniciar el backend
CMD ["npm", "start", "--prefix", "backend"]
