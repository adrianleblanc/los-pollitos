import Link from "next/link";
import { Heart, Shield } from "lucide-react";
import { YoutubeIcon, InstagramIcon, FacebookIcon } from "@/components/ui/icons";

export function PublicFooter() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-neutral-950 text-xl font-bold">
                🐥
              </div>
              <span className="text-lg font-black text-white">Los Pollitos Tejen</span>
            </div>
            <p className="text-neutral-400 text-xs max-w-sm leading-relaxed">
              Canal de YouTube dedicado a compartir el amor por el tejido a crochet. Tutoriales paso a paso, prendas para mascotas, gorros y patrones creativos.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.youtube.com/@LosPollitosTejen"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-red-500/10 hover:text-red-400 border border-neutral-800 transition-colors"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-blue-500/10 hover:text-blue-400 border border-neutral-800 transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-pink-500/10 hover:text-pink-400 border border-neutral-800 transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Categorías
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#mascotas" className="hover:text-amber-300 transition-colors">
                  Ropa para Mascotas
                </a>
              </li>
              <li>
                <a href="#prendas" className="hover:text-amber-300 transition-colors">
                  Gorros & Accesorios
                </a>
              </li>
              <li>
                <a href="#videos" className="hover:text-amber-300 transition-colors">
                  Flores & Amigurumis
                </a>
              </li>
              <li>
                <a href="#shorts" className="hover:text-amber-300 transition-colors">
                  Trucos Rápidos #Shorts
                </a>
              </li>
            </ul>
          </div>

          {/* Creator Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Administración
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Acceso Creadores</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-300 transition-colors">
                  Panel de Distribución Multi-red
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Los Pollitos Tejen. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>para amantes del crochet</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
