//src/components/SmartImage.jsx Use anywhere: <SmartImage src={product} alt={product.title} width={400} height={400} />
'use client';
import Image from 'next/image';
import { fixImageUrl } from '@/lib/image';

export default function SmartImage({ src, alt = '', width = 600, height = 600, ...rest }) {
  const safeSrc = fixImageUrl(src);
  return <Image src={safeSrc} alt={alt} width={width} height={height} {...rest} />;
}