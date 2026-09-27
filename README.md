# nodejs-playground

Hands-on POCs of the JavaScript and TypeScript ecosystem. Servers, frontend frameworks, runtimes, bundlers, testing tools, games and more. Every project is small and has its own folder.

## 🖥️ Servers & Backend Frameworks

HTTP servers and backend frameworks for Node.js, Deno and Bun.
From the raw `http` module up to full frameworks with plugins and DI.

* [basic](basic/) - Hello world HTTP server with the core `http` module
* [node.js-test](node.js-test/) - Minimal Node.js HTTP server
* [http-pure-simple](http-pure-simple/) - Pure Node.js HTTP server with no framework
* [simple-express](simple-express/) - Express server rendering Jade views
* [myapp-express](myapp-express/) - Express generator app with Jade, morgan and cookie-parser
* [express-db](express-db/) - Express app wired with body-parser and morgan
* [express-middleware-fun](express-middleware-fun/) - Custom Express middlewares
* [express-htmx-fun](express-htmx-fun/) - Express + HTMX + Pug + Sequelize on SQLite
* [nodejs-in-memory-api](nodejs-in-memory-api/) - REST API with Express and in-memory storage
* [nodejs-in-memory-api-sqllite](nodejs-in-memory-api-sqllite/) - REST API with Express and in-memory SQLite
* [node-ts-fun](node-ts-fun/) - Express written in TypeScript
* [gendernize-fun](gendernize-fun/) - Express API that guesses gender from a name via Genderize
* [simple-server-side-rendering](simple-server-side-rendering/) - Server side rendering with no framework
* [fastify-fun](fastify-fun/) - Minimal Fastify server
* [fastify-fun2](fastify-fun2/) - Fastify CLI app with autoload, plugins, tap tests and autocannon
* [hapi-fun](hapi-fun/) - hapi server
* [h3-fun](h3-fun/) - h3 minimal HTTP framework
* [hattip-fun](hattip-fun/) - HatTip universal server handlers on the Node adapter
* [hono-my-app](hono-my-app/) - Hono API inside a Next.js app
* [oakserver-fun](oakserver-fun/) - Oak middleware framework on the Deno HTTP server
* [princejs-fun](princejs-fun/) - PrinceJS framework on Bun
* [nestjs-fun](nestjs-fun/) - NestJS application
* [feathers-app](feathers-app/) - Feathers app with services and authentication
* [seneca-fun](seneca-fun/) - Seneca microservices with pattern matching
* [graphql-express-fun](graphql-express-fun/) - GraphQL API on Express
* [GraphQL-projects](GraphQL-projects/) - GraphQL server and Apollo client
* [soap](soap/) - SOAP client and server with node-soap
* [calc-socket.io](calc-socket.io/) - Calculator over Socket.IO
* [sample-socket.io](sample-socket.io/) - Socket.IO server and browser client
* [gaxios-fun](gaxios-fun/) - gaxios HTTP client from Google
* [apicurio-poc](apicurio-poc/) - Apicurio Registry managing OpenAPI schemas for a Node.js backend

## ⚛️ Frontend Frameworks

Frameworks and libraries that build the UI in the browser or on the server.
React and its meta-frameworks, plus the alternatives around it.

* [hello-next](hello-next/) - Hello world with Next.js
* [nextjs-Turbopack-fun](nextjs-Turbopack-fun/) - Next.js running on Turbopack
* [nextjs-virtual-routes](nextjs-virtual-routes/) - Next.js with virtual routes and Tailwind
* [shadcn-ui-next-simple](shadcn-ui-next-simple/) - shadcn/ui components on Next.js
* [remix-fun](remix-fun/) - Remix application
* [my-rari-app](my-rari-app/) - React Server Components with rari
* [qwik-fun](qwik-fun/) - Qwik resumable framework with Qwik City
* [astro-fun](astro-fun/) - Astro site
* [astro-7-poc](astro-7-poc/) - Deck of cards app with Astro 7 and TypeScript 6, no runtime libraries
* [react-tutorial-fun](react-tutorial-fun/) - React tutorial with Create React App
* [react-vite-fun](react-vite-fun/) - React on Vite
* [react-spring-vite-fun](react-spring-vite-fun/) - react-spring animations on React and Vite
* [redux-hell](redux-hell/) - React app with Redux boilerplate
* [tanstack-fun](tanstack-fun/) - TanStack Query with React
* [vite-8-bun-fun](vite-8-bun-fun/) - Vite 8 on Bun with TanStack Router, Query, Form and Table
* [bippy-fun](bippy-fun/) - Bippy hooking into React 19 internals
* [vidact-fun](vidact-fun/) - Movie rental counter in React compiled to VanillaJS by Vidact
* [videojs-fun](videojs-fun/) - Video.js v10 beta with React 19
* [liftkit-fun](liftkit-fun/) - LiftKit golden ratio UI components
* [zero-fun](zero-fun/) - Zero zero-config React server
* [glimmer-fun](glimmer-fun/) - Glimmer component app
* [mithril-fun](mithril-fun/) - Mithril.js single page app
* [my-malina-app](my-malina-app/) - Malina.js compiled web app
* [mint-fun](mint-fun/) - Mint language for single page apps
* [gea-js-node-fun](gea-js-node-fun/) - Gea.js with its Vite plugin
* [vue-storefront-simple](vue-storefront-simple/) - Vue Storefront shop
* [module-federation-simple](module-federation-simple/) - Two apps sharing code with Module Federation
* [docusaurus-fun](docusaurus-fun/) - Docusaurus documentation site
* [slidev-fun](slidev-fun/) - Slides written in Markdown with Slidev

## 📱 Desktop, Mobile, Terminal & Extensions

JavaScript outside the browser tab.
Native desktop windows, mobile apps, terminal UIs and browser extensions.

* [deno-2.9-desktop](deno-2.9-desktop/) - Native desktop calculator with `deno desktop`
* [nwjs-fun](nwjs-fun/) - NW.js desktop app
* [expo-fun](expo-fun/) - React Native app with Expo
* [cordovanpm-fun](cordovanpm-fun/) - Apache Cordova mobile app
* [simple-chrome-extension](simple-chrome-extension/) - Minimal Chrome extension
* [ink-reactr](ink-reactr/) - Ink terminal UI with React
* [giggles-fun](giggles-fun/) - Giggles terminal UI on Ink and React
* [gridlandio-func](gridlandio-func/) - Terminal UI rendered in the browser with Gridland.io
* [xterm-fun](xterm-fun/) - Terminal in the browser with xterm.js

## 🎨 CSS, Graphics & Animation

Styling, drawing and motion in the browser.
Pure CSS layouts, SVG, canvas, WebGL, Three.js and Gaussian splats.

* [center-a-div](center-a-div/) - Ways to center a div
* [grid-gen](grid-gen/) - CSS grid layout generator
* [98-fun](98-fun/) - Windows 98 look with 98.css
* [oat-fun](oat-fun/) - Oat minimal UI library
* [charts-css-fun](charts-css-fun/) - Charts built with pure CSS using Charts.css
* [lightningcss-fun](lightningcss-fun/) - Lightning CSS transforming and minifying stylesheets
* [gsap-fun](gsap-fun/) - GSAP animations
* [svg-js-fun](svg-js-fun/) - SVG drawing with SVG.js
* [crazy-effects-web](crazy-effects-web/) - Visual effects in the browser
* [webgl](webgl/) - Raw WebGL rendering
* [three.js-fun](three.js-fun/) - Spring garden scene in Three.js
* [sparkjs-fun](sparkjs-fun/) - Gaussian splats in Three.js with Spark
* [gramado-3d](gramado-3d/) - 3D scene of the Gramado entrance gate in Serra Gaucha, Brazil
* [milkway-simulator](milkway-simulator/) - Milky Way simulator in the browser
* [picknplacejs-fun](picknplacejs-fun/) - Pick and place drag interactions on Vite
* [infinite-scroll-simple](infinite-scroll-simple/) - Infinite scroll in plain JavaScript
* [web-apis-fun](web-apis-fun/) - Browser Web APIs tour

## 🎮 Games

Browser games, most of them in vanilla JavaScript with no engine.

* [bomberman](bomberman/) - Bomberman
* [killer-queen-game](killer-queen-game/) - Killer Queen with blue and yellow queens
* [snake-game](snake-game/) - Snake
* [space-invader-game](space-invader-game/) - Space Invaders in vanilla JS
* [memory-game](memory-game/) - Memory card game in JavaScript and CSS
* [pong](pong/) - Multiplayer Pong over Socket.IO
* [vibe-plane](vibe-plane/) - Flight simulator in JavaScript and HTML
* [kaplay-game](kaplay-game/) - Game built with the KAPLAY engine
* [odyc.js-game-fun](odyc.js-game-fun/) - Tiny game built with Odyc.js
* [capybara-pet-zoo](capybara-pet-zoo/) - Capybara pet zoo
* [nasty-trivia-fun](nasty-trivia-fun/) - Trivia game in React with confetti

## 🧰 Apps & Tools

Small complete apps that solve one real problem.

* [workos-fun-react-node](workos-fun-react-node/) - Local gym tracker, React frontend and Node backend with WorkOS login
* [gh-dashboard](gh-dashboard/) - GitHub dashboard in a single HTML page
* [lean-fishbowl](lean-fishbowl/) - Lean Fishbowl timer with Kanban-style columns
* [shuffler](shuffler/) - Shuffle ceremony that distributes items across teams
* [visual-ds-fun](visual-ds-fun/) - Data structures visualized next to their Java code and memory layout

## 🦕 Runtimes & Interop

Other ways to run JavaScript, and ways to reach other languages from it.

* [bun-shell-fun](bun-shell-fun/) - Bun Shell scripting
* [nub-fun](nub-fun/) - TypeScript + Express run by nub with no build step
* [llrt-amazon-js-runtime-fun](llrt-amazon-js-runtime-fun/) - LLRT, Amazon's low latency runtime for serverless
* [winterjs-fun](winterjs-fun/) - WinterJS service worker runtime
* [Nanos](Nanos/) - Node.js on the Nanos unikernel
* [js-vs-wasm](js-vs-wasm/) - JavaScript vs WebAssembly benchmark
* [nodejs-calling-java](nodejs-calling-java/) - Calling Java classes from Node.js
* [cobolscript-fun](cobolscript-fun/) - COBOL compiled to JavaScript with CobolScript

## 🔷 TypeScript & Languages

TypeScript, compilers, transpilers and languages that target JavaScript.

* [greeter-ts](greeter-ts/) - TypeScript compiled to JavaScript
* [typelevel-ts-playground](typelevel-ts-playground/) - Type-level TypeScript: conditional types, extract and more
* [typescript-7-go-compiler](typescript-7-go-compiler/) - Tamagotchi-like pet game compiled by TypeScript 7, the Go rewrite
* [zod-v4-fun](zod-v4-fun/) - Runtime schema validation with Zod 4
* [babel-simple-poc](babel-simple-poc/) - TypeScript lib transpiled with Babel and used from JavaScript
* [decorator-wrap-fun](decorator-wrap-fun/) - Decorators with Babel
* [purescript-fun](purescript-fun/) - PureScript with Spago
* [antlr-ng-fun](antlr-ng-fun/) - Calculator parser with antlr-ng

## 📦 Bundlers, Packages & Linters

How code gets built, packaged, shared and checked.

* [bundlers-benchmark](bundlers-benchmark/) - webpack vs Vite vs Rspack benchmarked
* [webpack-demo](webpack-demo/) - webpack basics with lodash
* [webpack-express-fun](webpack-express-fun/) - webpack bundle served by Express, with bundle analyzer
* [webpack-ts-fun](webpack-ts-fun/) - webpack with ts-loader
* [rollup-fun](rollup-fun/) - Rollup bundling
* [rspack-fun](rspack-fun/) - Rspack, the Rust webpack
* [parcel-fun](parcel-fun/) - Parcel zero-config bundler
* [turbopack-poc](turbopack-poc/) - Turbopack on Next.js
* [learn-fun](learn-fun/) - Monorepo with Lerna
* [local-file-import](local-file-import/) - Local Node.js lib imported by file path
* [npm-packagejson-lib-override-fun](npm-packagejson-lib-override-fun/) - Overriding nested dependencies with npm overrides
* [patch-package-fun](patch-package-fun/) - Patching node_modules with patch-package
* [knip-fun](knip-fun/) - Finding unused files, exports and deps with Knip
* [oxlint-fun](oxlint-fun/) - Oxlint, the Rust linter
* [typedoc-fun](typedoc-fun/) - API docs from TypeScript with TypeDoc

## 🧪 Testing & Quality

Unit, property, mutation, contract, browser and accessibility testing.

* [jasmine](jasmine/) - Jasmine specs
* [karma](karma/) - Karma test runner
* [qunit](qunit/) - QUnit in Node and the browser
* [jest-simple-fun](jest-simple-fun/) - Jest with Babel and React
* [vitest-fun](vitest-fun/) - Vitest with v8 coverage
* [japa-dev-fun](japa-dev-fun/) - Japa test runner in TypeScript
* [jsverify-fun](jsverify-fun/) - Property based testing with JSVerify
* [stryker-fun](stryker-fun/) - Mutation testing with Stryker
* [mswjs-fun](mswjs-fun/) - Mocking HTTP with MSW and Vitest
* [dreed-test](dreed-test/) - API contract testing with Dredd
* [bruno-postman-oss-fun](bruno-postman-oss-fun/) - API collections with the Bruno CLI
* [playwright-fun](playwright-fun/) - Browser tests with Playwright
* [rustwright-fun](rustwright-fun/) - Browser automation with Rustwright
* [testcafe-fun](testcafe-fun/) - Browser tests with TestCafe
* [pa11y-acessebility-testing-poc](pa11y-acessebility-testing-poc/) - Accessibility testing with pa11y 9 and TypeScript 6
* [benchmark-simple](benchmark-simple/) - Micro benchmarks with Benchmark.js

## 🧠 JavaScript Language & Functional Programming

The language itself: functions, async, the event loop and FP libraries.

* [arrow-function-fun](arrow-function-fun/) - Arrow functions
* [curried-function-fun](curried-function-fun/) - Currying
* [map-filter-fp-fun](map-filter-fp-fun/) - map, filter and reduce
* [fn](fn/) - Functional helpers with fn.js
* [immutable](immutable/) - Immutable.js collections
* [transducers](transducers/) - Transducers with transducers.js
* [underscore](underscore/) - Underscore.js
* [promise-fun](promise-fun/) - Promises
* [promisfy-fun](promisfy-fun/) - Callbacks to promises with promisify
* [event-emitter-fun](event-emitter-fun/) - EventEmitter in functional and class style
* [timeout-interval-fun](timeout-interval-fun/) - setTimeout and setInterval
* [tick-fun](tick-fun/) - Event loop order: nextTick, setImmediate and timeouts
* [counting-fun](counting-fun/) - console.count
* [js-trap-nan](js-trap-nan/) - NaN traps when parsing numbers
* [observable-webworker-fun](observable-webworker-fun/) - RxJS observables over worker threads
* [handlebars](handlebars/) - Handlebars templates
* [node-html-parser-fun](node-html-parser-fun/) - Parsing HTML with node-html-parser
* [node-emoji-fun](node-emoji-fun/) - Emojis with node-emoji
* [microdiff-fun](microdiff-fun/) - Object diffs with microdiff
* [progress-fun](progress-fun/) - Terminal progress bars

## 🗄️ Data & Persistence

Databases, ORMs and storage from Node.js.

* [lowdb-fun](lowdb-fun/) - JSON file database with lowdb
* [kv.js-fun](kv.js-fun/) - In-memory key-value store with kv.js
* [limbo-js](limbo-js/) - Limbo, the SQLite rewrite, from WASM
* [gunjs-fun](gunjs-fun/) - Decentralized graph database with GUN
* [eventstore-fun](eventstore-fun/) - Event sourcing with EventStoreDB
* [prototype-simple](prototype-simple/) - Calculator keeping state in Redis
* [drizzle-orm-bad](drizzle-orm-bad/) - Drizzle ORM on Postgres
* [prisma-orm-bad](prisma-orm-bad/) - Prisma ORM with migrations
* [prisma-postgres-orm-bad](prisma-postgres-orm-bad/) - Prisma ORM on Postgres with migrations

## 🔐 Auth

Signing and checking tokens.

* [jwt-sign-verify](jwt-sign-verify/) - Signing and verifying JWTs
* [jwt-open](jwt-open/) - Decoding a JWT without the secret

## 🩺 Debugging & Operations

Logs, stack traces, profiling, circuit breakers and process managers.

* [bunyan-fun](bunyan-fun/) - JSON logging with Bunyan
* [clarify-poc](clarify-poc/) - Cleaner stack traces with clarify
* [v8-profiler](v8-profiler/) - Profiling an Express app with V8
* [opossum-debug](opossum-debug/) - Circuit breaker with opossum and heap dumps
* [foreverjs-node-fun](foreverjs-node-fun/) - Keeping an Express app alive with forever
