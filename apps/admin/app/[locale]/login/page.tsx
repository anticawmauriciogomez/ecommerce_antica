import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-(--background)">
      <div className="w-full max-w-md space-y-12 rounded-3xl bg-(--card-bg) p-12 shadow-2xl shadow-accent-gold/5 border border-(--card-border)">
        <div className="text-center">
          <div className="inline-block p-4 rounded-3xl bg-accent-gold/10 mb-6 border border-accent-gold/20">
             <span className="text-2xl font-bold text-accent-gold">A</span>
          </div>
          <h2 className="text-4xl font-normal tracking-tight text-(--foreground)" style={{ fontFamily: 'var(--font-serif)' }}>
            <span className="text-accent-gold">Antica</span> Admin
          </h2>
          <p className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-[4px]">
            Ingreso al Sistema de Gestión
          </p>
        </div>
        <form className="mt-8 space-y-8" action={login}>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
                Correo Electrónico
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-2xl border border-(--card-border) bg-(--background) py-4 px-5 text-(--foreground) placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all duration-300 sm:text-sm font-medium"
                placeholder="ejemplo@antica.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-2xl border border-(--card-border) bg-(--background) py-4 px-5 text-(--foreground) placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all duration-300 sm:text-sm font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-2xl py-4 px-6 text-sm font-bold text-white shadow-xl shadow-accent-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-400"
              style={{ backgroundColor: '#cba87c' }}
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>


  )
}
