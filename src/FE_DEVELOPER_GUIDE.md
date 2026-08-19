# Ayursutra Frontend Developer Guide

Welcome to the Ayursutra frontend repository! This guide outlines our folder structure, architectural patterns, and the standard workflow for building new features. Please read this carefully to ensure we maintain a clean, consistent, and scalable codebase across the team.

## Folder Structure Overview

We use a **feature-based** folder structure combined with a `common` directory for shared resources. 

- `src/common/`: Contains components and utilities used across multiple features (e.g., Navbar, Sidebar, global utilities for data/UI formatting).
- `src/features/` or `src/<feature-name>/` (e.g., `auth`, `admin`, `doctor`, `therapist`): Each feature gets its own isolated folder containing all its specific types, APIs, hooks, components, and pages.
- `src/App.tsx`: Manages global routing and route security/protection.
- `src/index.css`: Contains global styles and reusable CSS classes.

### Example Feature Folder (`src/doctor/`)
```
doctor/
├── types/       # TypeScript interfaces/types based on backend JSON
├── apis/        # RTK Query endpoints for the feature
├── data/        # (Optional) Static mock data if backend isn't ready
├── hooks/       # Custom hooks for logic and state management
├── components/  # Sub-components (e.g., filters, tables, forms)
├── pages/       # The main feature page(s) combining the components
└── utils/       # (Optional) Feature-specific utility functions
```

## Standard Development Workflow

When starting a new feature (like "Doctor" or "Therapist"), always follow this step-by-step process:

### 1. Types (`types/`)
**Always start here.** Ask the backend team for the expected JSON request/response structures, and define your TypeScript interfaces and types. This ensures type safety from the beginning.

### 2. APIs (`apis/`)
Define your data fetching and mutations using **RTK Query**.
- Create feature-specific API files (e.g., `doctorApi.ts`).
- **Important:** We have a global base API configured in `src/apis/index.ts`. You must inject your feature endpoints into this global instance rather than creating a new `createApi` instance from scratch.
- **Mock Data Fallback:** If the backend endpoints are not ready yet, create a `data/` folder inside your feature. Put your static JSON data there, import it into your API file, and simulate the API response. Once the backend is ready, remove the mock data and swap in the real endpoint.

### 3. Hooks (`hooks/`)
To keep our components clean and focused purely on UI, extract complex business logic, API calls, and state management into custom hooks inside the `hooks/` folder.

### 4. Components (`components/`)
Break down your feature's UI into smaller, reusable sub-components (e.g., `DoctorFilter`, `DoctorTable`, `DoctorSummary`).
- Keep components small and focused.
- **Styling:** Use **Tailwind CSS v4**. Rely heavily on Flexbox and Grid for responsive design. Keep UI clean and consistent.

### 5. Pages (`pages/`)
Create the main container page for your feature. This page should import all the sub-components, pass down necessary props/state from your hooks, and assemble the final view. 

### 6. Test
Once the page is assembled, test the screen thoroughly for responsiveness, state changes, and API interactions.

## Best Practices & Guidelines

- **Common Directory:** Before building a generic component (like a button, modal, or layout wrapper) or a utility function (like date formatting), check if it already exists in the `src/common/` folder. If it's reusable across features, build it in `common/`.
- **Feature Utilities:** If a utility function is highly specific to your feature, place it in your feature's `utils/` folder instead of polluting the global space.
- **Routing:** All new feature pages must be registered in `src/App.tsx`. Ensure proper route security/auth guards are applied where necessary (refer to the already completed `auth` feature for examples).
- **Clean Code:** Separate logic (Hooks) from UI (Components). Keep your code modular.

Happy Coding!
