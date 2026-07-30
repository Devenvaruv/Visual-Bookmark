# Product Requirements

Visual Bookmark is a desktop-first dashboard for organizing links as visual cards on a grid canvas.

## MVP Scope

- Users can create, rename, delete, and switch boards.
- Each board has independent groups and bookmarks.
- Users can create bookmarks with a title, URL, and image.
- Bookmark cards show only image and title, never the raw URL.
- Clicking a bookmark opens the normalized URL in a new tab.
- Users can create, rename, resize, move, and delete groups.
- Bookmarks can be moved into or out of groups.
- Moving a group moves its child bookmarks through React Flow parent-child behavior.
- Positions persist after refresh.

## Primary Viewports

The main target is desktop at 1280px, 1440px, and 1920px widths. Smaller screens keep the sidebar collapsible and overlay the bookmark panel on the canvas.

## Visual Direction

The interface follows the provided reference: white canvas, subtle grid, soft borders, blue primary action, pastel group headers, rounded cards, clean sans-serif typography, and spacious controls.

