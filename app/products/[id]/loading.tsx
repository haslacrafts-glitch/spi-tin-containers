export default function ProductLoading() {
  return (
    <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-6 md:py-10 pb-24 md:pb-10 min-h-[70vh]">
      <p className="font-mono text-xs uppercase tracking-widest text-steel-blue mb-6">Loading product…</p>
      <div className="bg-white border border-metallic-silver grid grid-cols-1 lg:grid-cols-2">
        <div className="aspect-square bg-surface-container-low" />
        <div className="p-5 md:p-8 space-y-4">
          <div className="h-4 w-32 bg-industrial-gray" />
          <div className="h-8 w-3/4 bg-industrial-gray" />
          <div className="h-6 w-24 bg-industrial-gray" />
          <div className="h-20 w-full bg-surface-container-low" />
        </div>
      </div>
    </main>
  );
}
