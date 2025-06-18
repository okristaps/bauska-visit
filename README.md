# Jigsaw puzzle builder

This repository contains a application for building, editing, and playing interactive jigsaw puzzles. It includes a puzzle builder tool, a public puzzle game, and utilities for image normalization and puzzle configuration. At the start it was intended as a game only for a specific project. But as it turns out i needed to build a puzzle builder tool to achieve a puzzle game. So here's a tool for you. Not the best builder, but it works :)

## Overview

- **Puzzle Game:** Play interactive jigsaw puzzles based on real-world images and custom configurations.
- **Puzzle Builder Tool:** Admin interface for creating and editing puzzle piece connections, layouts, and configurations.
- **Image Normalization:** Utility page for cropping transparent PNGs and preparing puzzle piece assets.

## Features

- Drag-and-drop puzzle gameplay with timer.
- Admin tool for visually editing puzzle piece connections and layouts
- Automatic puzzle config generation from PNG assets using Node.js scripts
- Support for multiple puzzles with different layouts.
- Utility for cropping transparent PNGs and batch downloading as ZIP

## Tech Stack

- **Next.js** (App Router, SSR, API routes)
- **React 19** (functional components, hooks)
- **TypeScript** (type safety throughout)
- **Tailwind CSS** (utility-first styling)
- **next/font/google** (Lexend Deca font)
- **jszip** (client-side ZIP downloads)
- **sharp** (Node.js image processing for config generation)
- **react-dnd** (drag-and-drop in puzzle game)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Puzzle Builder Tool:**
   - Visit `/tool` (e.g., [http://localhost:3000/tool](http://localhost:3000/tool))
   - Requires desktop and development environment
   - Edit connections, add/remove points, and save puzzle configs

4. **Image Normalization Utility:**
   - Visit `/tool/image-normalization`
   - Upload PNGs, crop transparency, and download as ZIP

5. **Puzzle Game:**
   - Visit `/puzzle`, `/puzzle-2`, `/puzzle-3`, etc. to play puzzles

## Project Structure

- `src/app/` - Next.js app directory (pages, layouts, API routes)
- `src/components/` - React components (game, builder, UI)
- `src/config/` - Auto-generated puzzle config files
- `public/assets/puzzles/` - Puzzle piece PNG assets
- `scripts/analyzePuzzlePieces.ts` - Node.js script to generate puzzle configs from assets

## Generating Puzzle Configs

To generate a new puzzle config from PNG assets:
1. Place your PNGs in `public/assets/puzzles/puzzle_X/` (numbered 1.png, 2.png, ...)
2. Run:
   ```bash
   npm run analyze-puzzle puzzle_X
   ```
   This will create a config file in `src/config/`.

---

For more details, see the code and comments in each module. Contributions and feedback are welcome!

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
