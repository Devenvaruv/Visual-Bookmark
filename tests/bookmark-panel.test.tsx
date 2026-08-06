import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BookmarkPanel } from "@/components/bookmarks/bookmark-panel";

function renderPanel() {
  render(
    <BookmarkPanel
      open
      boardId="board-1"
      onClose={vi.fn()}
      onCreated={vi.fn()}
      onError={vi.fn()}
    />
  );
}

describe("BookmarkPanel", () => {
  it("fills the title from the URL domain", () => {
    renderPanel();

    fireEvent.change(screen.getByLabelText("URL"), { target: { value: "https://www.extern.com/" } });

    expect(screen.getByLabelText("Title")).toHaveValue("extern");
  });

  it("does not replace a title the user edited", () => {
    renderPanel();

    fireEvent.change(screen.getByLabelText("URL"), { target: { value: "https://www.extern.com/" } });
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Custom Name" } });
    fireEvent.change(screen.getByLabelText("URL"), { target: { value: "https://docs.example.in/path" } });

    expect(screen.getByLabelText("Title")).toHaveValue("Custom Name");
  });
});
