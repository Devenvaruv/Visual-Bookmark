# Canvas Behavior

The canvas is powered by React Flow.

## Grid

React Flow is configured with:

```tsx
snapToGrid
snapGrid={[20, 20]}
```

The background uses a subtle square grid.

## Parent-Child Groups

Groups are React Flow parent nodes. Bookmarks inside a group receive:

- `parentId`: the group id
- `extent`: `parent`
- position relative to the group

This makes group movement carry child bookmarks with it.

## Coordinate Conversion

When a bookmark enters a group:

```text
relativeX = absoluteBookmarkX - groupX
relativeY = absoluteBookmarkY - groupY
```

When a bookmark leaves a group:

```text
absoluteX = groupX + relativeBookmarkX
absoluteY = groupY + relativeBookmarkY
```

Positions are snapped to the 20px grid before persistence.

## Drag Persistence

During drag, React Flow updates local state only. On drag end, the app calculates the final group relationship and sends one position payload to the API.

