import { Heart, Sparkles, CheckCircle2, Award, Scissors } from "lucide-react";
import { YoutubeIcon } from "@/components/ui/icons";

export function AboutSection() {
  const highlights = [
    {
      title: "Paso a Paso Detallado",
      desc: "Explicamos cada punto, vuelta y disminución con tomas en primer plano y lenguaje claro.",
      icon: "🧶",
    },
    {
      title: "Proyectos para Todos",
      desc: "Desde tus primeras cadenetas hasta prendas complejas para mascotas, gorros temáticos y decoración.",
      icon: "🐱",
    },
    {
      title: "Comunidad Cálida",
      desc: "Más de 9.600 amantes del tejido que comparten sus dudas, avances y creaciones.",
      icon: "🐥",
    },
  ];

  return (
    <section id="sobre-nosotros" className="py-16 md:py-24 bg-gradient-to-b from-neutral-950 via-neutral-900/50 to-neutral-950 border-t border-b border-amber-950/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Mascot / Visual Card */}
          <div className="lg:col-span-5 text-center">
            <div className="relative inline-block">
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-rose-400 p-1.5 shadow-2xl shadow-amber-500/20">
                <div className="w-full h-full rounded-[22px] bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-5xl mb-4 shadow-inner">
                    🐥
                  </div>
                  <h3 className="text-xl font-black text-white">Los Pollitos Tejen</h3>
                  <p className="text-xs text-amber-300 font-medium mt-1">
                    Canal Oficial de Crochet
                  </p>
                  <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-center gap-3 text-xs text-neutral-400">
                    <span>9.6K Suscriptores</span>
                    <span>•</span>
                    <span>156 Videos</span>
                  </div>
                </div>
              </div>

              {/* Decorative badge */}
              <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-xl flex items-center gap-2">
                <YoutubeIcon className="w-4 h-4 fill-white" />
                <span>YouTube Creator</span>
              </div>
            </div>
          </div>

          {/* Text & Values */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span>Nuestra Pasión y Filosofía</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Tejer es transformar una hebra de lana en recuerdos y abrigo.
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              En <strong>Los Pollitos Tejen</strong> creemos que cualquier persona puede aprender a tejer a crochet si cuenta con la guía adecuada. Nuestro canal nació con el propósito de compartir patrones creativos, trucos útiles y proyectos únicos explicados con calma y cariño.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {highlights.map((h, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2"
                >
                  <span className="text-2xl block">{h.icon}</span>
                  <h4 className="text-sm font-bold text-white">{h.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href="https://www.youtube.com/@LosPollitosTejen"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Únete a nuestra comunidad en YouTube</span>
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
