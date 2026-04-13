'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // We stay in the same locale, but since we don't have it here easily, 
    // we redirect to /es/login by default or just /login and let middleware handle it.
    redirect('/es/login?error=Could not authenticate user')
  }

  // Redirect to the localized root
  redirect('/es')
}
