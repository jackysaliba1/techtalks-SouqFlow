# SouqFlow

SouqFlow is a backend for small merchants who want to keep their products, customers, orders and payments in one place. We built it with Java and Spring Boot during our internship at TechTalks.
Every merchant account only sees its own data. One shop can never see another shop's products or orders.

## What it does:

-Products and stock
Each product has a name, a price and a quantity. Stock is reduced through `InventoryService` when an order comes in. A request for zero or a negative amount is rejected, and so is a request for more than what is left. Otherwise the quantity is simply subtracted, so 50 minus 7 leaves 43.
We also made sure two orders can't break the stock. If a product has 10 in stock and two orders ask for 6 and 7 at the same time, only one of them goes through and the stock never drops below zero.
Every product has a low stock threshold (5 by default), so the app can tell you which products are running out.

-Customers and orders
Customers can be added and linked to their orders. An order starts as `PENDING` and moves on from there.

-Payments
Orders are paid through the payment APIs. A payment is linked to an order and keeps the amount in USD and LBP, the method, the status, a provider reference and a masked account number. We never store card numbers or full bank account details.
If a payment fails, the order stays `PENDING` and only that payment attempt is marked as failed.

-Dashboard
The dashboard shows tiles for Products, Customers, Orders, Payments, and Quotes & Invoices. All the numbers are filtered by the logged in account.

## Technologies:

the tools and tech stack i used:
-backend: Java, Spring Boot, spring data JPA, spring security, Maven, Lombok.
-frontend: Next.js(app router), React.js, tailwind CSS.
-database: MySQL.
-tools: IntellijIdea,MySQL workbench,postman.
-collaboration: Git, github, jira.

## Getting started:

Prerequisites:
-jdk version 25
-Maven
-lombok
-mysql running locally
-git and github
  1-create a new github repos by the team leader.
   -clone the repos: git clone<url>
   -cd techtalks-SouqFlow
 2-Configure the database:
   -create a database and set the connection details in application.properties(like db_pass,..)
 3-build and run(install all the dependencies in pom.xml)
   - ./mvnw spring-boot:run
   - the application starts on http://localhost:8080
4-each member gets his task and creates a new branch for every feature he's working on and then he push to github after.
   - no merge yet only push and then after finishing we merge into the main( of course after testing everything, the connection,security,ui,functionality).

## the project structure:

  -controllers:REST endpoints.
  -services: business logic(inventory,orders,payments).
  -repository: data access.
  -entity: Product, Customer,inventory,order.

# **TEAM JAVA B.**