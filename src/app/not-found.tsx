'use client';

export default function RootNotFound() {
  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center bg-white text-gray-900 font-sans antialiased">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="mt-4 text-gray-500">
            Pagina no encontrada / Page not found
          </p>
          <a
            href="/"
            className="mt-8 inline-block text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            Volver al inicio / Back to home
          </a>
        </div>
      </body>
    </html>
  );
}
