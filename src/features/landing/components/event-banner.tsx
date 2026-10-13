import { Button } from '@/components/ui/button';

export function EventBanner() {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-white">
      <h1 className="sr-only">Chúc mừng Ngày Phụ nữ Việt Nam 20/10</h1>
      <img
        src="/landing/women-day-20-10.png"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl sm:hidden"
      />
      <div className="absolute inset-0 bg-white/35 sm:hidden" aria-hidden />
      <img
        src="/landing/women-day-20-10.png"
        alt="Chúc mừng Ngày Phụ nữ Việt Nam 20/10. Tôn vinh vẻ đẹp và giá trị của chị em Astar Group."
        className="absolute inset-0 z-[1] h-full w-full object-contain object-center sm:object-cover"
      />
      <Button
        href="/login"
        variant="gold"
        size="lg"
        className="absolute inset-x-0 bottom-[7%] z-10 mx-auto w-fit px-8 shadow-lg shadow-amber-900/25"
      >
        Vào sự kiện
      </Button>
    </main>
  );
}
