'use client';

export default function RootNotFound() {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans antialiased">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="mt-4 text-muted">
            Pagina no encontrada / Page not found
          </p>
          <a
            href="/"
            className="mt-8 inline-block text-accent hover:text-accent-dark transition-colors font-medium"
          >
            Volver al inicio / Back to home
          </a>
        </div>
      </body>
    </html>
  );
}
