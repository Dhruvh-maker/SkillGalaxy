# SkillGalaxy Project Instructions

## Project Name
SkillGalaxy — AI-powered 3D Career Roadmap Generator

## Goal
Build a modern futuristic web application where users can enter a career or learning goal, and an AI-generated roadmap is visualized in interactive 3D space.

The application must look premium, visually stunning, and interactive.

No authentication system.
No database.
Frontend-only web application with AI API integration.

---

# Core Technologies

Use:

- React.js (JavaScript only)
- Vite
- React Three Fiber (Three.js)
- Framer Motion
- Axios
- Zustand (state management)
- CSS variables for theming

---

# Features to Build (in order)

## Phase 1 — Base UI

Create:

- Landing page
- Futuristic Hero section
- Goal input field
- Submit button
- Responsive layout
- Modern UI styling

UI must look premium.

---

## Phase 2 — Theme System

Add:

- Dark Mode
- Light Mode
- Theme toggle button
- Smooth transitions
- Neon glow accents in dark mode
- Clean minimal look in light mode

Ensure:

- Text readable in both modes
- Buttons adapt colors
- Background changes smoothly

---

## Phase 3 — AI Integration

Create:

File:

services/mistralApi.js

Requirements:

- Send user goal to Mistral API
- Receive structured roadmap JSON
- Handle loading state
- Handle errors
- Return clean structured data

Expected AI output format:

{
  "skills": [
    { "id": 1, "name": "HTML Basics" },
    { "id": 2, "name": "CSS Fundamentals" }
  ],
  "connections": [
    { "from": 1, "to": 2 }
  ]
}

AI must return JSON only.

---

## Phase 4 — Loading Animation

Create:

- Futuristic loading animation
- Particle animation
- Smooth fade transitions
- Show during API request

Use:

Framer Motion

---

## Phase 5 — 3D Visualization

Create:

3D roadmap scene using React Three Fiber.

Requirements:

- Each skill = floating sphere node
- Lines connect dependent skills
- Nodes animate with floating motion
- Add glow material
- Orbit controls enabled
- Zoom and rotate support

User interactions:

- Click node → show skill details
- Hover → highlight node

---

## Phase 6 — Node Layout Algorithm

Create:

utils/layoutGenerator.js

Requirements:

- Position nodes logically
- Parent skills higher
- Child skills below
- Avoid overlapping nodes
- Maintain readable spacing

---

## Phase 7 — Particle Background

Create:

- Floating background particles
- Glow effects
- Adaptive colors per theme

Dark Mode:

- Neon particles

Light Mode:

- Soft subtle particles

---

## Phase 8 — Polish & Animations

Add:

- Smooth transitions
- Hover effects
- Floating motion
- Scene lighting changes with theme
- Premium UI styling

---

# UI Expectations

Dark Mode:

- Dark background
- Neon glow accents
- Futuristic appearance

Light Mode:

- Soft background
- Clean minimal style
- Professional look

Transitions must feel smooth.

---

# Design Style

Target style:

- Futuristic
- Minimal
- Premium
- Modern

Use:

- Rounded corners
- Smooth animations
- Depth effects
- Shadows
- Glow effects

---

# Code Quality Rules

Always:

- Keep components modular
- Use reusable components
- Use clean folder structure
- Write readable code
- Avoid unnecessary complexity

---

# Performance Rules

Ensure:

- Smooth 3D animations
- No lag in camera movement
- Efficient rendering

---

# Future Expansion Friendly

Write code that allows:

- Adding new features later
- Supporting more roadmap types
- Exporting roadmap as file

---

# Important

Do not:

- Add authentication
- Add database
- Add unnecessary complexity

Focus on:

Visual quality + Interaction + AI roadmap generation.