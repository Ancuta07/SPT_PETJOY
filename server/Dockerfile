# Folosim Java 17
FROM eclipse-temurin:17-jdk-alpine

# Directorul de lucru în container
WORKDIR /app

# Copiem wrapper-ul Maven și fișierele necesare
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .
COPY pom.xml .

# Dam permisiuni de executie pentru mvnw
RUN chmod +x mvnw

# Copiem sursele
COPY src ./src

# Construim proiectul
RUN ./mvnw clean package -DskipTests

# Expunem portul backend
EXPOSE 8000

# Pornim aplicația
CMD ["java", "-jar", "target/backend-service-0.0.1-SNAPSHOT.jar"]