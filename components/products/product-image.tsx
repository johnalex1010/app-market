import { PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

export function ProductImage({ src, alt, className }: ProductImageProps) {
  if (src) {
    // La URL viene de Supabase o de un proveedor externo definido por el usuario; Next Image requiere dominios cerrados.
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} className={cn('h-full w-full object-cover', className)} decoding="async" height={160} loading="lazy" src={src} width={160} />;
  }

  return (
    <div
      aria-label={`Imagen no disponible para ${alt}`}
      className={cn('flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-400', className)}
      role="img"
    >
      <PackageOpen aria-hidden="true" className="h-5 w-5" />
    </div>
  );
}
