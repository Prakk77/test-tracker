'use client';

import { useRef } from 'react';

export default function CsvImport({
  environment,
  onImportSuccess,
}: {
  environment: string;
  onImportSuccess?: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('environment', environment);

    const res = await fetch('/api/import-csv', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert(data.error || 'Import failed');
      return;
    }

    alert(`Imported ${data.count} tests into ${environment}`);
    onImportSuccess?.();

    // reset input so same file can be uploaded again
    e.target.value = '';
  };

  return (
    <>
      {/* Hidden input */}
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Button */}
      <button
        onClick={handleClick}
        className="px-3 py-2 text-sm font-medium rounded-lg border border-border bg-bg-secondary text-text-primary hover:bg-bg-tertiary transition-colors"
      >
        Import CSV
      </button>
    </>
  );
}