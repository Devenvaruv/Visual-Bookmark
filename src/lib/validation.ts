import { z } from "zod";
import { normalizeUrl } from "@/lib/urls";

export const boardNameSchema = z.string().trim().min(1, "Board name is required.").max(60);

export const createBoardSchema = z.object({
  name: boardNameSchema
});

export const updateBoardSchema = z.object({
  name: boardNameSchema
});

export const bookmarkFormSchema = z
  .object({
    boardId: z.string().min(1),
    title: z.string().trim().min(1, "Title is required.").max(80),
    url: z
      .string()
      .trim()
      .min(1, "URL is required.")
      .transform((value, ctx) => {
        try {
          return normalizeUrl(value);
        } catch (error) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: error instanceof Error ? error.message : "Invalid URL."
          });
          return z.NEVER;
        }
      }),
    imageType: z.enum(["PLACEHOLDER", "UPLOAD", "FAVICON"]),
    imageValue: z.string().trim().min(1, "Choose an image.")
  })
  .superRefine((value, ctx) => {
    if (value.imageType !== "FAVICON") {
      return;
    }

    try {
      const parsed = new URL(value.imageValue);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error();
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["imageValue"],
        message: "Favicon must be an http or https URL."
      });
    }
  });

export const bookmarkPositionSchema = z.object({
  groupId: z.string().nullable(),
  positionX: z.number().int(),
  positionY: z.number().int(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional()
});

export const createGroupSchema = z.object({
  boardId: z.string().min(1),
  name: z.string().trim().min(1, "Group name is required.").max(80),
  positionX: z.number().int().default(80),
  positionY: z.number().int().default(80),
  width: z.number().int().min(260).default(440),
  height: z.number().int().min(180).default(280),
  color: z.string().trim().default("#eef6ff")
});

export const updateGroupSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  positionX: z.number().int().optional(),
  positionY: z.number().int().optional(),
  width: z.number().int().min(260).optional(),
  height: z.number().int().min(180).optional()
});
