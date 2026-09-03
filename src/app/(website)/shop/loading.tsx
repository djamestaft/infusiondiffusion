export default function ShopLoading() {
  return (
    <main
      aria-label="Loading collection"
      aria-busy="true"
      className="bg-content-surface min-h-dvh px-5 py-16 sm:px-8 lg:px-16"
    >
      <p className="text-content-secondary font-sans">
        Loading the collection…
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="bg-product-card-surface">
            <div className="bg-product-card-media-fallback aspect-square" />
            <div className="space-y-3 px-4 pt-3 pb-4">
              <div className="bg-product-card-media-fallback h-7 w-2/3" />
              <div className="bg-product-card-media-fallback h-4 w-1/3" />
              <div className="bg-product-card-media-fallback h-5 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
