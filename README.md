<p align="center">
  <img src="https://img.shields.io/badge/NestJS-Study%20Repo-red?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS Study Badge" />
</p>

<h1 align="center">
  📚 NestJS Journey
</h1>

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" alt="NestJS Logo" width="60%" />
</p>

<p align="center">
  🚀 Your go-to guide for learning <strong>NestJS</strong> – a progressive Node.js framework for building efficient, scalable, and maintainable server-side applications.
</p>

---

## 📌 About This Repo

This repository documents my **NestJS learning journey**, with organized notes, code examples, and project setups via a basic **RESTful API project**, demonstrating the **Contents** section.

Whether you're new to backend development or leveling up your TypeScript & Node.js skills, this guide can help you build production-grade NestJS apps with confidence.

<p align="center">

<img alt="Language" src="https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square">

<img alt="Framework" src="https://img.shields.io/badge/Framework-NestJS-red?style=flat-square">

<img alt="Status" src="https://img.shields.io/badge/Progress-Studying-yellow?style=flat-square">

</p>

---

# Core Concepts of the Framework

# Node Packages

| Name                     | Purpose                                                                    |
| ------------------------ | -------------------------------------------------------------------------- |
| @nestjs/common           | contains vast majority of functions , classes,etc , that we need from nest |
| @nestjs/platform-express | lets nest use express js from handling http requrests                      |
| reflect-metadata         | helps make decorators work                                                 |

# some figures before going into nest basics

## Nest does have 2 basic webservers (default is express)

![[Pasted image 20250805113659.png]]

## request-response lifesycle in every backend system

![[Pasted image 20250805114453.png]]

![[Pasted image 20250805114615.png]]

![[Pasted image 20250809051151.png]]![[Pasted image 20250809051203.png]]

# Parts of nest

![[Pasted image 20250805114854.png]]

---

---

# Our Very first application

```ts
import { Contoller, Module, Get } from "@nestjs/common";

import { NestFactory } from "@nestjs/core";

@Contoller()
class AppContoller {
  @Get()
  getRootRoute() {
    return "hi there !";
  }
}

@Module({
  contollers: [AppContoller],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppContoller);

  await app.listen(3000);
}

bootstrap();
```

---

## Application

- we can create HTTP server application via `NestFactory` , API end points ..aka web servers

```ts
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}
```

- Microservice

- standalone application

- > An app that **does not expose an HTTP server** (no REST, no WebSocket, no GraphQL). It’s just running some business logic like a CLI tool, background job, worker, etc., **fully managed by Nest’s DI system**, but **without controllers/routes**.

```ts

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { AppService } from './app.service';



async function bootstrap(){

const app = await NestFactory.createApplicationContext(AppModule);

await appService = app.get(AppService);

appService.doSomething();

}

```

---

## Modules

- modules are the building block of nestjs application , at the beginning we have the root module , and then othter modules and so on

![[Pasted image 20250717201909.png]]

- a module is a class that `Annotated` with @Module({}) annotation

```ts
import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";

import { AppService } from "./app.service";

@Module({
  imports: [],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
```

- this is the root module

- to create the application module graph , you define relationship between modules by passing object properties to the module decorator , and you define the related modules in the `import` property ,once you have modules you can add controllers

---

## Controllers

- controllers receive incoming requests and returning a response

![[Pasted image 20250717202703.png]]

- a controller is a class that annotated with @Controller annotation and takes the path to that endpoints

- each function is responsible for it's own method , thus can be annoted with an HTTP method like @Get , @Post ...etc , each of which can take a sub-path

- controllers mainly are responsible for handling requests and returning responses any thing else is delegated to other classes.

---

## Provider

- most of code you write in nest will be written in providers , a provider is a class that can be injected in other classes as a dependency

```ts
// cats.service.ts

import { Injectable } from "@nestjs/common";

@Injectable()
export class CatsService {
  findAll(): string[] {
    return ["Cat 1", "Cat 2", "Cat 3"];
  }
}
```

```ts
// cats.controller.ts

import { Controller, Get } from "@nestjs/common";

import { CatsService } from "./cats.service";

@Controller("cats")
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  findAll(): string[] {
    return this.catsService.findAll();
  }
}
```

```ts
// cats.module.ts

import { Module } from "@nestjs/common";

import { CatsController } from "./cats.controller";

import { CatsService } from "./cats.service";

@Module({
  controllers: [CatsController],

  providers: [CatsService],
})
export class CatsModule {}
```

- here is the story , the controller uses the provider (aka the service) , and since the provider is an injectable class it's annotated with @Injectable decorator , at the controller we provide the class with it's dependencies of services /providers (passing them in the constructor) , and to make nestjs DI container inject the provider , we declare it in providers property in the module .

---

# Service and Repostitory

![[Pasted image 20250810014530.png]]
![[Pasted image 20250810014855.png]]

- a service is a place to store business logic inside of it
- nest makes good separation of concerns (separates ui from business from storage relatred logic .... etc)
- so yes we need services even if the repositories and services looks identical , this will make changes when building application that scale , for instance when using multiple data sources we can't stack all connection , data extracting , business logic inside the service only.
- remember nestjs aims for scalability

---

## Entities

- an entity defines a single kind of resource / thing that we need to store in an application
- ex: we need to make users login/regiter by thier email & password , then we need to store data about thouse users , hence we create an entity for user
- and **Repository** for users to CRUD on the user thing
  ![[Pasted image 20250811031607.png]]
- step 1

```ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
```

- step 2

```ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "./user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])], // create repository
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

- step 3

```ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ReportsModule } from "./reports/reports.module";
import { User } from "./users/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## Middleware

- we can make a request go through several stages before it's handed over to the method handler , foe example we can use middleware to log every incoming request

```ts
// src/middleware/logger.middleware.ts

import { Injectable, NestMiddleware } from "@nestjs/common";

import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request received: ${req.method} ${req.originalUrl}`);

    next(); // Pass control to the next middleware or route handler
  }
}
```

```ts
// src/app.module.ts

import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";

import { AppController } from "./app.controller";

import { AppService } from "./app.service";

import { LoggerMiddleware } from "./middleware/logger.middleware";

@Module({
  imports: [],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer

      .apply(LoggerMiddleware)

      .forRoutes("*"); // Apply to all routes, or specify routes/controllers
  }
}
```

- middleware is a provider so it handled as a provider , the other part ins module we will discuss later.

---

## Guards

A guard is a class annotated with the `@Injectable()` decorator, which implements the `CanActivate` interface.

![](https://docs.nestjs.com/assets/Guards_1.png)

Guards have a **single responsibility**. They determine whether a given request will be handled by the route handler or not, depending on certain conditions (like permissions, roles, ACLs, etc.) present at run-time. This is often referred to as **authorization**. Authorization (and its cousin, **authentication**, with which it usually collaborates) has typically been handled by [middleware](https://docs.nestjs.com/middleware) in traditional Express applications. Middleware is a fine choice for authentication, since things like token validation and attaching properties to the `request` object are not strongly connected with a particular route context (and its metadata).

But middleware, by its nature, is dumb. It doesn't know which handler will be executed after calling the `next()` function. On the other hand, **Guards** have access to the `ExecutionContext` instance, and thus know exactly what's going to be executed next. They're designed, much like exception filters, pipes, and interceptors, to let you interpose processing logic at exactly the right point in the request/response cycle, and to do so declaratively. This helps keep your code DRY and declarative.

> **Hint** Guards are executed **after** all middleware, but **before** any interceptor or pipe.

---

## Interceptors

is a typical `request-response`  of how users or clients interact with a server. Let’s say a client makes a request to the Nest API endpoint. That will then process that request and send back a response to the client. An interceptor is what lies between the `request` and the `response`. For example, we can create an interceptor so that when a client makes a request to the server, it will be intercepted by the interceptor before the request reaches the server.

### What’s the difference between Interceptor vs Middleware vs Filter

\*\*Interceptors

> \*\*Interceptors have access to response/request before *and* after the route handler is called.

\*\*Middleware

> \*\*Middleware is called only before the route handler is called

\*\*Exception Filters

> \*\*Exception Filters are called after the route handler and after the interceptors

In the interceptor, we can do any processes and modify the request before it’s sent to the server. We can also set up the interceptor to intercept the response before being sent back to the client.

### Example

- as an example on interceptors , imagine we have setup a user CRUD , the read service returns the user's data , we need to filter out some properties? (ie.user password)

- nest's docs recommends to follow an approach , which have some downsides , we will discuss it later , this is the approach
  ![[Pasted image 20250815120235.png]]

```ts
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { CreateUserDTO } from "./dtos/createuser.dto";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Controller("auth")
export class UsersController {
  constructor(private readonly userSerivce: UsersService) {}

  @Post("/signup")
  CreateUser(@Body() data: CreateUserDTO) {
    return this.userSerivce.create(data.email, data.password);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/:id")
  async findUser(@Param("id") id: string) {
    const user = await this.userSerivce.findOne(+id);
    if (!user) {
      throw new NotFoundException("User Not Found");
    }
    return user;
  }

  @Get()
  findAllUsers(@Query("email") email: string) {
    return this.userSerivce.find(email);
  }

  @Patch("/:id")
  updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.userSerivce.update(+id, body);
  }

  @Delete("/:id")
  removeUser(@Param("id") id: string) {
    return this.userSerivce.remove(+id);
  }
}
```

and this is the entity

```ts
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Exclude } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log("Inserted User With id ", this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log("updated use wtih");
  }

  @AfterRemove()
  logRemove() {
    console.log("Removed User with id");
  }
}
```

- we applied `@Exclude()` from 'class-transformer' package to mark the password field as execluded from read
- then in the controller , we imported 2 things , first `useInterceptors`

#### Downsides

![[Pasted image 20250815121213.png]]

- imagine an admin that uses the same service to get his own copy of user's data , and a public endpoints that get it's own copy of the data , now based on the solution that we built what could the user entity instance carry?

- the answer is **nothing** here we tied up the view rules to the entity instance this is not a good separation of concerns , what we should really do is the following
  ![[Pasted image 20250815121930.png]]
- we will return the user entity , without modifying it , then impelemnt a custom interceptor , that uses a DTO (Data Transfer Object) that describes how to serialize the user for this route handler , remember DTO is used to transfere data between different places in out application (not only used for incoming data , but also used in other langs / frameworks to handle the format of outgoing data as well)

## How To Create An Interceptor ?

- when we create an interceptor whe can apply it to a particular route (what we did ) , or to the whole controller , or globally

- when we create an interceptor we must override a method called `intercept`
  ![[Pasted image 20250815122758.png]]

```ts
import { NestInterceptor, CallHandler, ExecutionContext } from "@nestjs/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // run something before a request is handede by the request handler (middleware)
    console.log("Iam running before the hander ", context);

    return handler.handle().pipe(
      map((data: any) => {
        // run something bwfore a response is sent out
        console.log("Iam running bwfore response is sent out", data);
      })
    );
  }
}
```

#### 1. Imports

- **`NestInterceptor`** → Interface that your interceptor must implement.
- **`ExecutionContext`** → Gives you access to things like `req`, `res`, the controller, handler metadata, etc.
- **`CallHandler`** → Represents the actual method in the controller that will be called.
- **`rxjs` + `map()`** → Used to intercept and transform the data stream coming _out_ of the controller.
- **`plainToClass`** → Converts raw JavaScript objects into class instances (useful for serialization).

#### 2.first part

```ts
export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // run something before a request is handede by the request handler (middleware)
    console.log('Iam running before the hander ', context);

```

**`intercept`** runs **before the controller’s method is called**.  
At this point:

- The request has been received.
- You can inspect/modify the request here if you want.
- You have **not** yet hit the controller method.

#### 3.second part

```ts
    return handler.handle().pipe(
      map((data: any) => {
        // run something before a response is sent out
        console.log('Iam running before response is sent out', data);
      }),
    );
  }
}
```

- **`handler.handle()`** → This actually executes the controller’s method and returns its result **as an Observable**.
- **`.pipe(map(...))`** → Here you can **transform or replace** the controller’s returned data before sending it back to the client.
  - In your case, you’re only logging, but you could:
    - Filter out sensitive fields (password, tokens, etc.).
    - Transform database objects into DTOs.
    - Add extra metadata to the response.

### Now With example

![[Pasted image 20250816235712.png]]

- now we want to achive this , to do so , we need to create a new DTO to filter the data we want to return

```ts
import { Expose } from "class-transformer";

export class UserDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
```

- `Expose()` tells dto that the comming data we want to just expose the id , email
- now update the interceptor logic that sends data to client

```ts
import { NestInterceptor, CallHandler, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";
import { UserDTO } from "src/users/dtos/user.dto";

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // run something before a request is handede by the request handler (middleware)
    console.log("Iam running before the hander ", context);

    return handler.handle().pipe(
      map((data: any) => {
        // run something bwfore a response is sent out
        console.log("Iam running bwfore response is sent out", data);
        return plainToClass(UserDTO, data, {
          excludeExtraneousValues: true, // this will ensure that only the properties decorated with @Expose() are included in the serialized output
        });
      })
    );
  }
}
```

- `plainToClass` takes a **plain JavaScript object** (like one you get from your DB, or a raw JSON) and turns it into an **instance of a class** (like your `UserDTO`).

- aight this is cool , but we can use that SerializeInterptor to more than one case write , it only depeneds on the dto we are passing to it
- so we could inject that dto in the constructor of the class

```ts
import { NestInterceptor, CallHandler, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";
import { UserDTO } from "src/users/dtos/user.dto";

export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // run something before a request is handede by the request handler (middleware)
    console.log("Iam running before the hander ", context);

    return handler.handle().pipe(
      map((data: any) => {
        // run something bwfore a response is sent out
        console.log("Iam running bwfore response is sent out", data);
        return plainToClass(UserDTO, data, {
          excludeExtraneousValues: true, // this will ensure that only the properties decorated with @Expose() are included in the serialized output
        });
      })
    );
  }
}
```

- now this Interceotor will work with any kind of DTO we pass in , userDTO , MessageDTO .... etc
- we use it like this `  @UseInterceptors(new SerializeInterceptor(UserDTO))`

- that's cool , but we could make this better by applying it to a custom decorator

```ts
import { UseInterceptors } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
import { SerializeInterceptor } from "src/interceptors/serialize.interceptor";

export function Serialize(dto: ClassConstructor<any>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
```

- this decorator will be used to auto useInterceptor with the SeruakuzeInterceptor DTO
- that ClassConstructor interface is a typescript trick to make it more type-safelly

```ts
interface ClassConstructor<T> {
  new (...args: any[]): T;
}
```

- In TypeScript, an `interface` can describe not just objects, but also _callable_ or _constructable_ types.
- `new (...args: any[]): T` means:
      > "This is a type that can be instantiated with `new`, with any number of arguments, and the result is some object."
  `plainToInstance` requires a **class constructor** as its first argument:

`plainToInstance(this.dto, data, { excludeExtraneousValues: true });`

If you didn’t add the `ClassConstructor` interface, TypeScript would just see `dto: any`, meaning you could accidentally pass in something that isn’t a class, and `plainToInstance` would break at runtime.

This gives **type safety**: only proper classes (with a `new` signature) are allowed.

---

## Pipes

A pipe is a class annotated with the `@Injectable()` decorator, which implements the `PipeTransform` interface.

![](https://docs.nestjs.com/assets/Pipe_1.png)

Pipes have two typical use cases:

- **transformation**: transform input data to the desired form (e.g., from string to integer)

- **validation**: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception

In both cases, pipes operate on the `arguments` being processed by a [controller route handler](https://docs.nestjs.com/controllers#route-parameters). Nest interposes a pipe just before a method is invoked, and the pipe receives the arguments destined for the method and operates on them. Any transformation or validation operation takes place at that time, after which the route handler is invoked with any (potentially) transformed arguments.

Nest comes with a number of built-in pipes that you can use out-of-the-box. You can also build your own custom pipes. In this chapter, we'll introduce the built-in pipes and show how to bind them to route handlers. We'll then examine several custom-built pipes to show how you can build one from scratch.

```ts
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

- the `whitelist: true` setting is telling the pipe to ignore all things sent in the body and accept only the things within the dto

  ***

## Exception Filters

![[Pasted image 20250813045720.png]]

- we don't throw errors in services becouse if we do so , nest will capture it , but for other type of controllers (websocket / grpc) they are don't know that notfoundexception ..
- as a solution we must build our own exception filers

---

## Data Transfer Object(DTO)

![[Pasted image 20250810010245.png]]

- DTO (Data Transfer Object) is a design pattern that is commonly used in software development to transfer data between different layers of an application. The main idea behind the DTO pattern is to encapsulate data and provide a standardised way of transferring it between different parts of the application.

- In practice, a ==DTO is a simple object that contains data and may have some validation logic==. It defines part or all data of a domain object, but do not have any business login in it. It’s typically used to transfer data between the client and the server, or between different layers of the server-side application. The DTO object is usually created by the server-side code, populated with data from a database or other sources, and then sent to the client. The client-side code can then use the DTO object to display data to the user or to send it back to the server for processing.

---

## Class-Transformer and Class-validator

### 1.Class-Transformer

In JavaScript there are two types of objects:

- plain (literal) objects
- class (constructor) objects

Plain objects are objects that are instances of `Object` class. Sometimes they are called **literal** objects, when created via `{}` notation. Class objects are instances of classes with own defined constructor, properties and methods. Usually you define them via `class` notation.

So, what is the problem?

Sometimes you want to transform plain javascript object to the ES6 **classes** you have. For example, if you are loading a json from your backend, some api or from a json file, and after you `JSON.parse` it you have a plain javascript object, not instance of class you have.

For example you have a list of users in your `users.json` that you are loading:

```json
[
  {
    "id": 1,
    "firstName": "Johny",
    "lastName": "Cage",
    "age": 27
  },
  {
    "id": 2,
    "firstName": "Ismoil",
    "lastName": "Somoni",
    "age": 50
  },
  {
    "id": 3,
    "firstName": "Luke",
    "lastName": "Dacascos",
    "age": 12
  }
]
```

And you have a `User` class:

```ts
export class User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;

  getName() {
    return this.firstName + " " + this.lastName;
  }

  isAdult() {
    return this.age > 36 && this.age < 60;
  }
}
```

You are assuming that you are downloading users of type `User` from `users.json` file and may want to write following code:

```ts
fetch("users.json").then((users: User[]) => {
  // you can use users here, and type hinting also will be available to you,
  //  but users are not actually instances of User class
  // this means that you can't use methods of User class
});
```

In this code you can use `users[0].id`, you can also use `users[0].firstName` and `users[0].lastName`. However you cannot use `users[0].getName()` or `users[0].isAdult()` because "users" actually is array of plain javascript objects, not instances of User object. You actually lied to compiler when you said that its `users: User[]`.

So what to do? How to make a `users` array of instances of `User` objects instead of plain javascript objects? Solution is to create new instances of User object and manually copy all properties to new objects. But things may go wrong very fast once you have a more complex object hierarchy.

Alternatives? Yes, you can use class-transformer. Purpose of this library is to help you to map your plain javascript objects to the instances of classes you have.

This library also great for models exposed in your APIs, because it provides a great tooling to control what your models are exposing in your API. Here is an example how it will look like:

```ts
fetch("users.json").then((users: Object[]) => {
  const realUsers = plainToInstance(User, users);
  // now each user in realUsers is an instance of User class
});
```

Now you can use `users[0].getName()` and `users[0].isAdult()` methods.

### 2.Class-Validator

- validating properties inside a class using decorators

### 3.The Flow

![[Pasted image 20250810011541.png]]

### 4.How js knows that we are exactly use that dto?

```ts
import { IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  content: string;
}
```

```ts
import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { CreateMessageDto } from "./dtos/create-message.dto";

@Controller("/messages")
export class MessagesController {
  @Post()
  createMessage(@Body() body: CreateMessageDto) {
    console.log(body);
  }
}
```

- let's take a look at tsconfig.json

```json
{
  "compilerOptions": {
    "module": "commonjs",

    "declaration": true,

    "removeComments": true,

    "emitDecoratorMetadata": true,

    "experimentalDecorators": true,

    "allowSyntheticDefaultImports": true,

    "target": "ES2023",

    "sourceMap": true,

    "outDir": "./dist",

    "baseUrl": "./",

    "incremental": true,

    "skipLibCheck": true,

    "strictNullChecks": true,

    "forceConsistentCasingInFileNames": true,

    "noImplicitAny": false,

    "strictBindCallApply": false,

    "noFallthroughCasesInSwitch": false
  }
}
```

- the `emitDecoratorMetadata:true` setting
  In your **`tsconfig.json`**, when you set:

json

CopyEdit

`{   "compilerOptions": {     "emitDecoratorMetadata": true,     "experimentalDecorators": true   } }`

…TypeScript will **generate extra “design-time” type info** at runtime when a decorator is used.

This is important because **JavaScript normally throws away type information** when compiled from TypeScript:

ts

CopyEdit

`createMessage(@Body() body: CreateMessageDto) { }`

becomes **plain JS** without any knowledge of what `body` is supposed to be.

With `emitDecoratorMetadata: true`, TypeScript **adds hidden calls** to `Reflect.metadata()` so that your runtime code can still know:

> “The first parameter of `createMessage` should be a `CreateMessageDto` object.”

---

## 2️⃣ What happens during compilation

Your original method:

ts

CopyEdit

`@Post() createMessage(@Body() body: CreateMessageDto) {     console.log(body); }`

turns into (simplified JS):

js

CopyEdit

`__decorate([     Post(),     __param(0, Body()),     __metadata("design:type", Function),     __metadata("design:paramtypes", [CreateMessageDto]),     __metadata("design:returntype", void 0) ], MessagesController.prototype, "createMessage", null);`

Let’s decode this.

---

## 3️⃣ Understanding the generated calls

### a) `__decorate`

This is a TypeScript helper function that applies decorators to classes, methods, or properties.

Think of it like:

js

CopyEdit

`Post()(MessagesController.prototype, "createMessage");`

---

### b) `__param(0, Body())`

This applies the `@Body()` decorator to **parameter #0** (the first argument of the method).

---

### c) `__metadata(...)`

This comes from the **`reflect-metadata`** library (which NestJS uses under the hood).

- `__metadata("design:type", Function)`  
   Says: “This method is of type `Function`” (method type metadata).
- `__metadata("design:paramtypes", [CreateMessageDto])`  
   Says: “This method’s first parameter type is `CreateMessageDto`” (parameter type metadata).
- `__metadata("design:returntype", void 0)`  
   Says: “The return type of this method is `void`” (return type metadata).

---

## 4️⃣ Why NestJS needs this

When NestJS sees:

ts

CopyEdit

`createMessage(@Body() body: CreateMessageDto) { ... }`

It uses `Reflect.getMetadata('design:paramtypes', target, propertyKey)` to get:

js

CopyEdit

`[ CreateMessageDto ]`

That tells NestJS:

> “Okay, I should take the incoming request body, create a `CreateMessageDto` instance, and run class-validator rules on it.”

Without `emitDecoratorMetadata`, NestJS wouldn’t know `body` was a `CreateMessageDto`, so it couldn’t auto-validate or transform it.

---

## 5️⃣ TL;DR mental model

- **`emitDecoratorMetadata`** = Keep type info alive at runtime for decorators.
- **`__metadata(...)`** = Writes that type info so `Reflect.getMetadata()` can read it later.
- **NestJS** = Reads that metadata to:
  - Instantiate DTOs.
  - Run `class-validator`.
  - Transform incoming JSON into the right class.

---

If you want, I can **write a small pure JavaScript demo** showing how `Reflect.metadata` works without NestJS, so you can see the whole process outside of the framework. That would make the whole "behind the scenes" crystal clear. Would you like me to do that?

---

# Dependency Injection

## Nest DI Container

![[Pasted image 20250810030501.png]]

- at startup , register all classes with the container
- container will figure out what each dependency each class has
- we then ask the container to create an instance of a class for us
- container creates all required dependencies and gives us the instance
- container will hold onto the created dependency instances and reuse them if needed.

to apply DI we follow 2 steps , nest DI will take care else

- first: mark classes that are dependecies for other classes with @Ijectable() annotation - **All Dependencies are Singletons by default**
- second: add them to the modules list of providers
-

## DI Inside of a module

![[Pasted image 20250810054812.png]]

## DI between modules

![[Pasted image 20250810055305.png]]

- `exports` property in `@Module({})` annotation is telling that this modules is exporting his x to other modules
- `imports` property in `@Module({})` annotation is telling that this module has a relationship with other module (import modules)

---

# Database Integration (TypeORM)

![[Pasted image 20250811024643.png]]

- this is a way to creating a database configuration , through the appModule
- `@nestjs/typeorm` makes typeorm usage easly with nestjs

```ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ReportsModule } from "./reports/reports.module";

import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      entities: [],
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- we import it in out appModule , and setup the configurations

#### Migration

- Changes the structure of the database (add column , remove column , change types ....etc)
  ![[Pasted image 20250811033327.png]]
- `syncronize: true` setting is telling typeorm to automatically look for my entities and do migrations, **Used Only in development environments**
- class name = 'user' , table name = 'users'

#### TypeOrm Builtin Repositories

```ts
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
}
```

- lots of things going here :\_
- well we have discussed the DI system in nestjs , well things are little more different in case of **Generic classes**
- nest's DI system doesn't work with Generics , so we add the `@IjectRepository(User)` to tell nest like hey deal with this as a normal class and inject it .

#### Create Vs Save in Repository APIs

![[Pasted image 20250812022205.png]]

- some times we can add some validation inside the dto class , so we must run create first and then save to save data to database
- we can also just use save to create and save data
- typeorm hockes also required to use create

```ts
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log("Inserted User With id ", this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log("updated use wtih");
  }

  @AfterRemove()
  logRemove() {
    console.log("Removed User with id");
  }
}
```

---

# Notes

- while testing it's not good practice to use anything that is trying to read / write from disk as it's resource intensive

---

# Projects

# 1

![[Pasted image 20250811022325.png]]
![[Pasted image 20250811022501.png]]
![[Pasted image 20250811022733.png]]
