# ArtiTask

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.18.

## Prerequisites
- Node.js: v20.19+ (Angular 20 requires Node 20.19 or 22.12+).
- npm: installed with Node.
- (Optional) Angular CLI globally

## Steps to run the project locally
1. Clone the repository
2. Install dependencies
```bash
npm install
```
3. Start the development server

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Suggestion for a real-time implementation to handle chat responses
1. What approach I'd use (WebSocket, SSE, long polling, etc.) and why did I choose it?
    
    The right approach depends on the nature of interaction and two common scenarios would require different solutions.
    1. Scenario bidirectional chat - WebSocket

        If the application requires users to exchange messages in real time with some additional features (typing indicators, etc.), WebSockets would be the recommended approach. They establish an efficient bidirectional (full-duplex) connection with low latency. This means that both the client and the server can push their messages at any time without overhead of repeated HTTP requests. There are no requests/response cycles, no headers, just frames. Main cons for WebSockets are complexity to implement and manage them as well as their scalability because managing many connections could be challenging. 
    
    2. Scenario AI responses, live feeds, notifications, progress updates - SSE

        If the communication is one directional meaning that the server pushes updates to client without needing the client to respond Server-Sent Events are a better option. Since it runs over plain HTTP it's firewall friendly and easier to scale compared to WebSockets. Browser also handles automatic reconnection. A long lived HTTP connection is opened and the server streams data down. Main disadvantages are that is text-only, no binary data can be sent, small connection limit and does not support custom headers like Authorization.


    For this project, since the main requirement would be to stream AI responses from server to client in near real time, I'd use SSE. It gives a simpler and scalable solution.
2. Libraries/tools I'd consider using in Angular
    - NgRx for more complex state management around chat sessions and chatbot configuration
    - Angular Material with CDK for consistent UI components and features like virtual scroll for long chat histories
    - ESLint and Prettier for consistent formatting and linting
    - ngx-socket-io wrapper for WebSockets if there would be a need for WebSockets
    - RxJS operators
3. What would I improve with more time?
    - Refine overall UX and visual design
    - When backend is introduced
        - Centralize HTTP and WebSocket/SSE handling with interceptors and services
        - Provide user-friendly error messages and automatic retries
        - Introducing state management with NgRx for more complex scenarios
        - Add loading states and skeletons
    - Better component reusability by creating generic reusable components
    - Adding ESLint and Prettier for consistent formatting and linting
    - This is a fairly simple app but adding tests to protect the core flows
    - Encryption for sensitive chats
