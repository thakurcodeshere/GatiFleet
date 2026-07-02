# Contributing to GatiFleet

First off, thank you for considering contributing to GatiFleet! It's people like you who make GatiFleet such an excellent transportation operating system.

## How Can I Contribute?

### Reporting Bugs
- Ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/thakurcodeshere/GatiFleet/issues).
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/thakurcodeshere/GatiFleet/issues/new). Use the **Bug Report** template to provide detail.

### Suggesting Enhancements
- Check if the feature is already requested or discussed.
- Open a new issue using the **Feature Request** template to propose your enhancement.

### Pull Requests
1. Fork the repository and create your branch from `main`.
2. **Install Frontend Dependencies:** Run `npm install` in the root directory.
3. **Install Backend Dependencies:** Run `cd server && npm install` in the server directory.
4. Make your changes in the appropriate directory (`src/` for React UI, `server/` for Express APIs).
5. Verify code quality on the frontend by running the linter:
   ```bash
   npm run lint
   ```
6. Build the frontend locally to verify it compiles:
   ```bash
   npm run build
   ```
7. Start the backend (`npx pm2 start ecosystem.config.js`) to test API integrations.
8. Submit a Pull Request targeting the `main` branch of this repository, following the PR template guidelines.

## Code Style Guide
- We use ESLint for code style verification.
- Write descriptive component and variable names.
- Keep JSX files clean and modular.

Thank you for contributing!
