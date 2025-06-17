export default function MessageLoading() {
  return (
    <div className="px-2 md:px-3 grid grid-cols-[56px_1fr_12px] md:grid-cols-[60px_1fr_12px] justify-center w-full mt-6">
      <div className="w-[32px] aspect-square rounded-full [background-image:url('/images/ikeda_01.jpg')] bg-cover bg-center" />
      <div className="w-full flex flex-col gap-3">
        <div className="w-1/2 h-3 bg-foreground/20 rounded-full animate-pulse animate-duration-200" />
        <div className="w-1/3 h-3 bg-foreground/20 rounded-full animate-pulse animate-duration-200" />
      </div>
    </div>
  );
}