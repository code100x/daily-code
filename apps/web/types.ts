import z from "zod";
export const AddTrackSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().url(),
  notionUrl: z.string().url(),
});

export type AddTrack = z.infer<typeof AddTrackSchema>;
