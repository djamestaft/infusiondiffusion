export default function ProductLoading() {
  return (
    <main
      aria-label="Loading fragrance details"
      aria-busy="true"
      className="bg-content-surface grid min-h-dvh gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-2 lg:px-16 lg:py-16"
    >
      <div className="bg-product-card-media-fallback aspect-[31/36]" />
      <div className="space-y-5 pt-4">
        <div className="bg-product-card-media-fallback h-14 w-4/5" />
        <div className="bg-product-card-media-fallback h-8 w-1/3" />
        <p className="text-content-secondary font-sans">
          Loading fragrance details…
        </p>
      </div>
    </main>
  );
}
