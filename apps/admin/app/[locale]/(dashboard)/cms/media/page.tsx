import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getStorefrontContent } from "../actions";
import { MediaForm } from "./_components/MediaForm";

export const dynamic = "force-dynamic";

type MediaSlot = { key: string; label: string; type: string };
type MediaGroup = { group: string; items: MediaSlot[] };
type CmsSchema = { mediaSlots: MediaGroup[] };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadSchema(): CmsSchema {
  try {
    const possiblePaths = [
      join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "..",
        "packages",
        "cms-config",
        "schema.json",
      ),
      join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "..",
        "..",
        "packages",
        "cms-config",
        "schema.json",
      ),
      join(process.cwd(), "..", "packages", "cms-config", "schema.json"),
      join(process.cwd(), "..", "..", "packages", "cms-config", "schema.json"),
      join(
        process.cwd(),
        "..",
        "..",
        "..",
        "packages",
        "cms-config",
        "schema.json",
      ),
    ];

    let schemaPath = "";
    for (const p of possiblePaths) {
      if (existsSync(p)) {
        schemaPath = p;
        break;
      }
    }

    if (!schemaPath) {
      console.warn("[CMS Media] No se encontró schema.json en ninguna ruta");
      return { mediaSlots: [] };
    }

    console.log("[CMS Media] Cargando schema desde:", schemaPath);
    const rawSchema = readFileSync(schemaPath, "utf8").replace(/^\uFEFF/, "");
    return JSON.parse(rawSchema) as CmsSchema;
  } catch (e) {
    console.warn(
      "[CMS Media] No se pudo leer schema.json, usando fallback.",
      e,
    );
    return { mediaSlots: [] };
  }
}

export default async function MediaCMSPage() {
  const mediaRegistry = await getStorefrontContent("media_registry");
  const schema = loadSchema();

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <MediaForm
        mediaSlots={schema.mediaSlots ?? []}
        initialRegistry={mediaRegistry || {}}
      />
    </div>
  );
}
