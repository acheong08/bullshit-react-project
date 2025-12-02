## Tech Stack

- **Full stack framework** React + Server Components (w/ Typescript)
- **Database**: PostgreSQL with TypeORM
- **Builder**: Bun
- **Testing**: Bun test with happy-dom and @testing-library
- **Deployment**: Podman/Docker + compose

See [Alternatives considered](wiki/Alternatives.md)

See [Reasoning behind tech stack choices](wiki/TechStack.md)

## Programming Language: Typescript
Typescript is a super-set of Javascript, the premier language for the web. This means it offers all of Javascript's features and functions, but with an additional layer on top of these: Typescript's type system. 
This allows for errors to do with types (which Javascript encounters regularly) to be debugged more efficiently.

https://www.typescriptlang.org/docs/handbook/intro.html - Official Docs     
https://www.codecademy.com/learn/learn-typescript - Free Codecademy courses     
https://www.totaltypescript.com/ - In depth free courses to use     
https://www.youtube.com/watch?v=30LWjhZzg50 - Full length course covering Typescript

## Javascript
Since Typescript is, for the most part, an extension of Javascript, it's important to have a good understanding of how it works to be able to build on this project.

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide - Mozilla JS Guide     
https://www.javascripttutorial.net/javascript-number/ - Free practical JS tutorials     
https://www.tutorialspoint.com/javascript - In depth coverage of JS, free tutorials <    
https://www.youtube.com/watch?v=EerdGm-ehJQ - Full length course covering JS

# Full Stack Framework: React + Server Components
## React (Front-end)
React is a modern front-end library that uses Javascript or Typescript as the language. Our project uses the Typescript version.
React is a tool that is mostly used for building UI components, which are then rendered and manipulated in a virtual DOM prior to the browser's DOM being altered.

https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Frameworks_libraries/React_getting_started - Mozilla React Guide <br/>
https://react.dev/learn - Official React Docs <br/>
https://www.youtube.com/watch?v=TtPXvEcE11E - React Full Course <br/>
https://www.youtube.com/watch?v=TPACABQTHvM - Course on Typescript in React     
https://react-tutorial.app/ - Interactive tutorial

### React Server Components
React Server Components are a new type of component that render before bundling in a separate environment to the client app.
This allows for things like database queries to happen inside React components.

https://react.dev/reference/rsc/server-components - Official Docs     
https://www.freecodecamp.org/news/react-server-components-for-beginners/ - Beginner level tutorials     
https://hackernoon.com/getting-started-with-react-server-components-a-step-by-step-tutorial - Practical tutorials    
https://www.youtube.com/watch?v=ePAPd9qzGyM - React Server Components Video Course

## Database: PostgreSQL with TypeORM

### PostgreSQL
PostgreSQL is an open-source, object-relational database system that extends SQL, adding features that can scale complicated data workloads

https://www.postgresql.org/about/ - Official Docs    
https://neon.com/postgresql/tutorial - Basic PostgreSQL tutorial    
https://www.pgtutorial.com/postgresql-tutorial/postgresql-distinct-on/ - Interactive PostgreSQL tutorial     
https://www.youtube.com/watch?v=qw--VYLpxG4 - Full PostgreSQL course    

### TypeORM
TypeORM is an ORM that can run in React, and aims to support the latest Javascript features.

https://typeorm.io/docs/getting-started/ - Official Docs    
https://codebubb.com/posts/learn-typeorm-in-10-minutes/ - Free tutorial     
https://www.youtube.com/watch?v=BCPTRCvASk0&t=156s - Online course   
https://cricketsamya.medium.com/building-a-backend-with-typeorm-and-postgresql-6ff38529c22d - TypeORM + PostgreSQL Specific Tutorial

## Builder: Bun
Bun is a toolkit that can be used for developing Javascript and Typescript applications. It has fast package install times, as well as built-in runners and bundlers.

https://bun.com/docs - Official Bun docs  
https://last9.io/blog/getting-started-with-bun-js/ - Bun quickstart guide  
https://www.youtube.com/watch?v=eTB0UCDnMQo - Bun tutorial (video)

### Alternative: NPM
NPM is an alternative to Bun, and can also be used for this project.

https://docs.npmjs.com/about-npm - Official NPM docs   
https://nodesource.com/blog/an-absolute-beginners-guide-to-using-npm - Guide to NPM (beginner)   
https://www.youtube.com/watch?v=2V1UUhBJ62Y - NPM Course (Video)   

## Testing: Bun test with happy-dom and @testing-library
### Bun test
Bun test is a built-in test runner for this project that is compatible with Jest, and offers Typescript support.

https://bun.com/docs/test - Bun Test Official Docs   
https://jestjs.io/docs/using-matchers - Jest official docs + guidelines   
https://www.youtube.com/watch?v=9eGvLdCfBOk - Bun Test video guide   
https://www.youtube.com/watch?v=l6C-nRG83pQ - Testing with Jest in Typescript   

### Happy-dom
A way to implement a web browser without a graphical user interface that can be used for testing.

https://github.com/capricorn86/happy-dom - Official repo link    
https://www.jetbrains.com/guide/javascript/tutorials/eleventy-tsx/happy-dom/ - Guide to testing with Happy DOM   

### @testing-library
@testing-library provides a set of custom Jest matchers that can be used to make tests more declarative, clear to read and easy to maintain.

https://www.npmjs.com/package/@testing-library/jest-dom - Official Docs     
https://www.browserstack.com/guide/testing-library-jest-dom - Testing library guide   
https://www.youtube.com/watch?v=ML5egqL3YFE - Testing Library video tutorial   

## Deployment: Podman/Docker + Compose
### Podman
Podman is an open source tool designed to make running, building and deploying applications simpler.

https://docs.podman.io/en/latest/ - Official Docs   
https://devopscube.com/podman-tutorial-beginners/ - Podman step by step tutorial   
https://www.youtube.com/watch?v=5WML8gX2F1c&t=93s - Podman video tutorial   

#### Podman Compose
Podman Compose is used to define and run multi-container applications.

https://linuxhandbook.com/courses/podman/podman-compose/ - Podman compose explanation    
https://docs.podman.io/en/v5.6.2/markdown/podman-compose.1.html - Podman compose docs   

### Docker
Docker is an alternative to Podman that is compatible with this project, allowing the same functionality.

https://docs.docker.com/get-started/docker-overview/ - Official docs   
https://docker-curriculum.com/ - Docker beginner's tutorial   
https://www.youtube.com/watch?v=DQdB7wFEygo - Docker video tutorial   

#### Docker Compose
Docker Compose is an alternative tool used to define and run multi-container applications.

https://docs.docker.com/compose/ - Official docs     
https://spacelift.io/blog/docker-compose - Docker compose beginner's guide   
https://www.youtube.com/watch?v=DM65_JyGxCo - Docker compose video tutorial   