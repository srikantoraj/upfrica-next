import dynamic from 'next/dynamic';
const UploadTester = dynamic(() => import('../components/UploadTester'), { ssr: false });

export default function UploadTestPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Upload test</h1>
      <UploadTester />
    </main>
  );
}