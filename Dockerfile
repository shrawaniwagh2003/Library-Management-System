# Stage 1: Build
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml . 
# Copy the source code
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app
COPY --from=build /app/target/SpringMongoProject-0.0.1-SNAPSHOT.jar demo.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "demo.jar"]
