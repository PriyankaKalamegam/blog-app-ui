import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const next = documentHeight <= 0 ? 0 : (window.scrollY / documentHeight) * 100;
      setProgress(Math.max(0, Math.min(100, next)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed left-0 right-0 top-[61px] z-30 h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
