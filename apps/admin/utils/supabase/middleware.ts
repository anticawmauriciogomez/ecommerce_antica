import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isApiRoute = pathname.startsWith('/api')
  const isStaticFile = pathname.includes('.')
  
  // Validar si el path tiene un prefijo de idioma válido
  const hasValidPrefix = pathname.startsWith('/es') || pathname.startsWith('/en')
  const isLoginPage = pathname.endsWith('/login')

  // 1. Si no tiene prefijo válido y no es API ni archivo estático, forzar prefijo
  if (!hasValidPrefix && !isApiRoute && !isStaticFile) {
    const url = request.nextUrl.clone()
    if (pathname === '/login') {
      url.pathname = '/es/login'
    } else {
      url.pathname = `/es${pathname === '/' ? '' : pathname}`
    }
    return NextResponse.redirect(url)
  }

  // Logged in users shouldn't see any login page
  if (user && isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/es' 
    return NextResponse.redirect(url)
  }

  // Not logged in users should be redirected to login page unless it's a login page
  if (!user && !isLoginPage && !isApiRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/es/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
