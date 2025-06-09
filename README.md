# 🚀 TypeScript MCP Server Starter Template

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6)

This repository provides an opinionated starter template for building a TypeScript-based MCP (Model Context Protocol) server. It's designed to give you a quick and robust foundation for your agent-powered applications. ✨

## ⚡ Powered by FastMCP

At its core, this server is built using [FastMCP](https://github.com/punkpeye/fastmcp), a lightweight and efficient framework for creating MCP servers. This template also leverages [Bun](https://bun.sh/) for a blazing-fast development and runtime experience, and [Zod](https://zod.dev/) for robust schema validation and type inference. 

## 🏗️ Architecture Overview

This template follows a clear and modular architecture, making it easy to extend and maintain:

-   **`src/`**: Contains the main source code.
    -   **`core/`**: Houses the fundamental building blocks of your MCP server:
        -   `prompts/`: Definitions for generative prompts and messages.
        -   `resources/`: Abstractions for external data sources or services.
        -   `tools/`: Implementations of actions or utilities your agent can perform.
    -   **`server/`**: Contains the server initialization and configuration logic.
-   **`tests/`**: Unit and integration tests, mirroring the `src/` structure.
-   **`docs/`**: Important documentation for both human and AI agents, including `ARCHITECTURE.md` and `AGENT_RULES.md`.

For a more detailed breakdown, refer to `docs/ARCHITECTURE.md`. 📖

## 🏁 Getting Started

Follow these simple steps to get your MCP server up and running:

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```

2.  **Install dependencies:**
    This project uses `bun` as the preferred package manager and runtime. Make sure you have Bun installed.
    ```bash
    bun install
    ```

3.  **Start the server:**
    You can run the server in two modes:

    -   **stdio Transport (CLI Mode)**: Ideal for local development and direct CLI interaction.
        ```bash
        bun start
        # Or for development with auto-reload
        bun run dev
        ```

    -   **HTTP Transport (Web Mode)**: Suitable for web applications and remote access. By default, it runs on port 3001.
        ```bash
        bun run start:http
        # Or for development with auto-reload
        bun run dev:http
        
        # To change the port (e.g., to 8080):
        PORT=8080 bun run start:http
        ```

## 📝 Contributing

We welcome contributions! Please refer to [our contribution guidelines(agents and humans)](docs/AGENT_RULES.md) for important rules regarding typing, documentation, and testing. 🤝



// "httpStreamServer": {
//  "url": "http://localhost:3000/mcp",
//  "type": "httpStream"
// }