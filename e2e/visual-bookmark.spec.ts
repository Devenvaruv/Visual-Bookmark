import { expect, test } from "@playwright/test";

test("creates a board, group, and bookmark, then preserves them after reload", async ({ page }) => {
  await page.goto("/");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Board name");
    await dialog.accept(`E2E Board ${Date.now()}`);
  });
  await page.getByRole("button", { name: "New Board" }).click();

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Group name");
    await dialog.accept("E2E Group");
  });
  await page.getByRole("button", { name: "New Group" }).click();
  await expect(page.getByText("E2E Group")).toBeVisible();

  await page.getByRole("button", { name: "New Bookmark" }).click();
  await page.getByLabel("Title").fill("E2E Bookmark");
  await page.getByLabel("URL").fill("example.com");
  await page.getByRole("button", { name: "Create Bookmark" }).click();
  await expect(page.getByText("E2E Bookmark")).toBeVisible();

  await page.reload();
  await expect(page.getByText("E2E Group")).toBeVisible();
  await expect(page.getByText("E2E Bookmark")).toBeVisible();
});

