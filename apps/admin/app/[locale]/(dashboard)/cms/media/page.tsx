import { readFileSync } from 'fs'
import { join } from 'path'
import { getStorefrontContent } from '../actions'
import { MediaForm } from './_components/MediaForm'

export const dynamic = 'force-dynamic'

type MediaSlot = { key: string; label: string; type: string }
type MediaGroup = { group: string; items: MediaSlot[] }
type CmsSchema = { mediaSlots: MediaGroup[] }

function loadSchema(): CmsSchema {
  try {
    // process.cwd() = apps/admin cuando corre Next.js
    const schemaPath = join(process.cwd(), '..', '..', 'packages', 'cms-config', 'schema.json')
    const rawSchema = readFileSync(schemaPath, 'utf8').replace(/^\uFEFF/, '')
    return JSON.parse(rawSchema) as CmsSchema
  } catch {
    console.warn('[CMS Media] No se pudo leer schema.json, usando fallback.')
    return { mediaSlots: [] }
  }
}

export default async function MediaCMSPage() {
  const mediaRegistry = await getStorefrontContent('media_registry')
  const schema = loadSchema()

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <MediaForm
        mediaSlots={schema.mediaSlots ?? []}
        initialRegistry={mediaRegistry || {}}
      />
    </div>

  )
}
