# ---- Stage 1: Build frontend ----
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ---- Stage 2: Build backend (with frontend embedded) ----
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY backend/pom.xml .
RUN mvn -B -q dependency:go-offline
COPY backend/src ./src
COPY --from=frontend-build /app/dist ./src/main/resources/static/
RUN mvn -B -q clean package -DskipTests

# ---- Stage 3: Runtime ----
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
