"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";

export default defineConfig({
  name: "infusion-diffusion",
  title: "Infusion Diffusion",
  projectId,
  dataset,
  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
