<h1 align="center">
  🚀 NestJS Study Repo
</h1>

<p align="center">
  🧠 <strong>Mastering NestJS</strong> — from the core concepts to clean architecture, testing, and real-world backend patterns.
</p>

<p align="center">
  🦄 Built with ❤️ to help you level up your TypeScript + Node backend skills using the <strong><a href="https://nestjs.com/">NestJS</a></strong> framework.
</p>

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="100" alt="NestJS Logo" />
</p>
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

# Parts of nest
![[Pasted image 20250805114854.png]]

# Our Very first application
```ts
import {Contoller,Module,Get} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';

@Contoller()
class AppContoller{
	@Get()
	getRootRoute(){
		return 'hi there !';
	}
}

@Module({
	contollers:[AppContoller]
})

class AppModule{}

async function bootstrap(){
	const app = await NestFactory.create(AppContoller);
	await app.listen(3000);
}
bootstrap();
```
## Application
- we can create HTTP server application via `NestFactory` , API end points ..aka web servers

```ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap(){
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

## Modules
- modules are the building block of nestjs application , at the beginning we have the root module , and then othter modules and so on
 ![[Pasted image 20250717201909.png]]
- a module is a class that `Annotated` with @Module({}) annotation
```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```
- this is the root module

- to create the application module graph , you define relationship between modules by passing object properties to the module decorator , and you define the related modules in the `import` property ,once you have modules you can add controllers

## Controllers
- controllers receive incoming requests and returning a response
![[Pasted image 20250717202703.png]]
- a controller is a class that annotated with @Controller annotation and takes the path to that endpoints
- each function is responsible for it's own method , thus can be annoted with an HTTP method like @Get , @Post ...etc , each of which can take a sub-path
- controllers mainly are responsible for handling requests and returning  responses any thing else is delegated to other classes.

## Provider
- most of code you write in nest will be written in providers , a provider is a class that can be injected in other classes as a dependency

```ts
// cats.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  findAll(): string[] {
    return ['Cat 1', 'Cat 2', 'Cat 3'];
  }
}
```

```ts 
// cats.controller.ts
import { Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
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
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}

```
- here is the story , the controller uses the provider (aka the service) , and since the provider is an injectable class it's annotated with @Injectable decorator , at the controller we provide the class with it's dependencies of services /providers (passing them in the constructor) , and to make nestjs DI container inject the provider , we declare it in providers property in the module .
## Middleware
- we can make a request go through several stages before it's handed over to the method handler , foe example we can use middleware to log every incoming request
```ts
    // src/middleware/logger.middleware.ts
    import { Injectable, NestMiddleware } from '@nestjs/common';
    import { Request, Response, NextFunction } from 'express';

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
    import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';
    import { LoggerMiddleware } from './middleware/logger.middleware';

    @Module({
      imports: [],
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule implements NestModule {
      configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(LoggerMiddleware)
          .forRoutes('*'); // Apply to all routes, or specify routes/controllers
      }
    }
```

- middleware is a provider so it handled as a provider , the other part ins module we will discuss later.

## Guards

A guard is a class annotated with the `@Injectable()` decorator, which implements the `CanActivate` interface.

![](https://docs.nestjs.com/assets/Guards_1.png)

Guards have a **single responsibility**. They determine whether a given request will be handled by the route handler or not, depending on certain conditions (like permissions, roles, ACLs, etc.) present at run-time. This is often referred to as **authorization**. Authorization (and its cousin, **authentication**, with which it usually collaborates) has typically been handled by [middleware](https://docs.nestjs.com/middleware) in traditional Express applications. Middleware is a fine choice for authentication, since things like token validation and attaching properties to the `request` object are not strongly connected with a particular route context (and its metadata).

But middleware, by its nature, is dumb. It doesn't know which handler will be executed after calling the `next()` function. On the other hand, **Guards** have access to the `ExecutionContext` instance, and thus know exactly what's going to be executed next. They're designed, much like exception filters, pipes, and interceptors, to let you interpose processing logic at exactly the right point in the request/response cycle, and to do so declaratively. This helps keep your code DRY and declarative.

> **Hint** Guards are executed **after** all middleware, but **before** any interceptor or pipe.

## Interceptors
is a typical `request-response`  of how users or clients interact with a server. Let’s say a client makes a request to the Nest API endpoint. That will then process that request and send back a response to the client. An interceptor is what lies between the `request` and the `response`. For example, we can create an interceptor so that when a client makes a request to the server, it will be intercepted by the interceptor before the request reaches the server.

### What’s the difference between Interceptor vs Middleware vs Filter

> **Interceptors  
> **Interceptors have access to response/request before _and_ after the route handler is called.
> 
> **Middleware  
> **Middleware is called only before the route handler is called
> 
> **Exception Filters  
> **Exception Filters are called after the route handler and after the interceptors


In the interceptor, we can do any processes and modify the request before it’s sent to the server. We can also set up the interceptor to intercept the response before being sent back to the client.
## Pipes

A pipe is a class annotated with the `@Injectable()` decorator, which implements the `PipeTransform` interface.

![](https://docs.nestjs.com/assets/Pipe_1.png)

Pipes have two typical use cases:

- **transformation**: transform input data to the desired form (e.g., from string to integer)
- **validation**: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception

In both cases, pipes operate on the `arguments` being processed by a [controller route handler](https://docs.nestjs.com/controllers#route-parameters). Nest interposes a pipe just before a method is invoked, and the pipe receives the arguments destined for the method and operates on them. Any transformation or validation operation takes place at that time, after which the route handler is invoked with any (potentially) transformed arguments.

Nest comes with a number of built-in pipes that you can use out-of-the-box. You can also build your own custom pipes. In this chapter, we'll introduce the built-in pipes and show how to bind them to route handlers. We'll then examine several custom-built pipes to show how you can build one from scratch.

## Exception Filters


## Data Transfer Object(DTO)
- DTO (Data Transfer Object) is a design pattern that is commonly used in software development to transfer data between different layers of an application. The main idea behind the DTO pattern is to encapsulate data and provide a standardised way of transferring it between different parts of the application.

- In practice, a ==DTO is a simple object that contains data and may have some validation logic==. It defines part or all data of a domain object, but do not have any business login in it. It’s typically used to transfer data between the client and the server, or between different layers of the server-side application. The DTO object is usually created by the server-side code, populated with data from a database or other sources, and then sent to the client. The client-side code can then use the DTO object to display data to the user or to send it back to the server for processing.


---
# Messages Project 
## Some diagrams
![[Pasted image 20250805122329.png]]![[Pasted image 20250805122417.png]]
![[Pasted image 20250805122521.png]]
![[Pasted image 20250805122645.png]]

