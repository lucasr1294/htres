// Página de login — autenticación via Supabase Auth
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold text-center">HTres</h1>
        <p className="text-muted-foreground text-center">
          Ingresá con tu cuenta para continuar
        </p>
        {/* TODO: agregar formulario de login con Supabase Auth */}
      </div>
    </div>
  );
}
