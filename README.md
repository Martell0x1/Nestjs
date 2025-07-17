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
## Interceptors
## Pipes
## Exception Filters
