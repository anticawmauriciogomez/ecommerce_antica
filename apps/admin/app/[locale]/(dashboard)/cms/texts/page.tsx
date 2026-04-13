import { getStorefrontContent } from '../actions'
import { baseDictionaryEs, baseDictionaryEn } from './baseDictionary'
import { TextsForm } from './_components/TextsForm'

export const dynamic = 'force-dynamic'

export default async function TextsCMSPage() {
  const savedTranslations = await getStorefrontContent('translations')

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <TextsForm
        baseDictionaryEs={baseDictionaryEs as Record<string, unknown>}
        baseDictionaryEn={baseDictionaryEn as Record<string, unknown>}
        savedTranslations={savedTranslations}
      />
    </div>

  )
}
