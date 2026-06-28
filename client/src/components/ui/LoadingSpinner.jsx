/**
 * Cakes and Crunches — Loading Spinner UI Component
 *
 * Futuristic full screen or inline loading spinner.
 */

export default function LoadingSpinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bg-primary z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin glow"></div>
          <p className="text-text-secondary font-display tracking-widest text-sm animate-pulse">
            CAKES & CRUNCHES
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
