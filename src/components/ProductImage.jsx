'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import { getCardImage, FALLBACK_IMG } from '@/lib/images';

export default function ProductImage({
  product,
  alt,
  className = '',
  fill = true,
  sizes = '(max-width:768px) 50vw, (max-width:1200px) 33vw, 20vw',
  priority = false,
  width,
  height,
}) {
  const [broken, setBroken] = useState(false);

  const src = useMemo(() => {
    if (broken) return FALLBACK_IMG;
    return getCardImage(product) || FALLBACK_IMG;
  }, [product, broken]);

  const label = alt || product?.title || 'Product image';

  if (fill) {
    return (
      <Image
        src={src}
        alt={label}
        fill
        sizes={sizes}
        className={`object-cover ${className}`}
        onError={() => setBroken(true)}
        placeholder="empty"
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={label}
      width={width || 600}
      height={height || 600}
      sizes={sizes}
      className={`object-cover ${className}`}
      onError={() => setBroken(true)}
      placeholder="empty"
      priority={priority}
    />
  );
}