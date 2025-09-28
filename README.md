# NestJS + Prisma 

This guide explains how to create a new **NestJS project**, set up **Prisma ORM**, configure your schema, run migrations, and generate the Prisma client.

---

## 1. Create a New NestJS Project

```bash
# Install NestJS CLI (if not installed)
npm install -g @nestjs/cli

# Create a new project
nest new PROJECT-NAME

# Move into project directory
cd PROJECT-NAME
# Run the Project (:dev for fast reload )
npm run start:dev 
```

---

## 2. Install Prisma and Dependencies

Prisma requires both the CLI and a database connector.

```bash
# Install Prisma and TypeScript types
npm install prisma --save-dev
npm install @prisma/client
```

Initialize Prisma in your project:

```bash
npx prisma init
```

This creates:

* a `prisma/` folder with `schema.prisma`
* a `.env` file for database connection URL

---

## 3. We  Configure `schema.prisma`

Open `prisma/schema.prisma` and define your data models. 

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

Update your `.env` file with your database connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

---




## 4. Run Migrations

After defining your models, run migrations to apply changes to the database:

```bash
npx prisma migrate dev --name init
```

This will:

* Create a new migration file inside `prisma/migrations/`
* Update your database schema


---
## We Got some errors here : 
error: Type "category" is neither a built-in type, nor refers to another model, composite type, or enum. Did you mean "Category"?
  -->  prisma\schema.prisma:66
   | 
65 | 
66 |   categories        category[]
   | 
error: Type "productItemPrice" is neither a built-in type, nor refers to another model, composite type, or enum.
  -->  prisma\schema.prisma:112
   | 
111 | 
112 |   productItemPrices     productItemPrice[]
   | 
error: Type "decimal" is neither a built-in type, nor refers to another model, composite type, or enum. Did you mean "Decimal"?
  -->  prisma\schema.prisma:127
   | 
126 | 
127 |   price decimal?


## 5. Generate Prisma Client

If you change the schema, regenerate the Prisma client 
If you don't generate the Prisma Client, it will not regocnize the new attributs in  the service

```bash
npx prisma generate
```
---

## 6. Using Prisma in NestJS

Prisma can be integrated using a `PrismaService`:

```ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

Add it to your `AppModule`:

```ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
```

---

## 7. Useful Prisma Commands
Each Time you make changes on the DataBase you should use the migrate command 

* **Migrate DB changes**

  ```bash
  npx prisma migrate dev --name <migration-name>
  ```

* **Open Prisma Studio (GUI for DB)**

  ```bash
  npx prisma studio
  ```

* **Regenerate client**

  ```bash
  npx prisma generate
  ```

---

I was not able to fully complete the entire project, here’s what I managed to implement:

-  **Category API**
  - Create new categories
  - Some GET endpoints to fetch categories

-  **Product API**
  - Create new products
  - Some GET endpoints to fetch products

-  **Product Item API**
  - Create new product items
  - Basic fetching endpoints

These endpoints were tested using **APIDOG** during development.



## 7. After creation the API Project we will use APIDOG to test the apis 