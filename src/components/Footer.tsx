export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 max-w-6xl py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()}{' '}
            <span className="font-semibold text-blue-600">
              {process.env.NEXT_PUBLIC_APP_NAME || 'jjsad'}
            </span>
            {' '}— Social Note Taking
          </p>
          <p>Built with Next.js & TypeORM</p>
        </div>
      </div>
    </footer>
  );
}
