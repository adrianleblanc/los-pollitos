"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";
import {
  YoutubeIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
} from "@/components/ui/icons";

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-amber-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo with Official Circular Image */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-md shadow-amber-500/20 transition-transform group-hover:scale-105 shrink-0 bg-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Los Pollitos Tejen Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white block group-hover:text-amber-300 transition-colors">
              Los Pollitos Tejen
            </span>
            <span className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1">
              <span>Crochet con amor</span>
              <span>•</span>
              <span>Tutoriales</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-300">
          <a href="#videos" className="hover:text-amber-300 transition-colors">
            Tutoriales
          </a>
          <a href="#mascotas" className="hover:text-amber-300 transition-colors">
            Mascotas 🐱🐶
          </a>
          <a href="#prendas" className="hover:text-amber-300 transition-colors">
            Prendas & Gorros
          </a>
          <a href="#shorts" className="hover:text-amber-300 transition-colors">
            Shorts & Tips
          </a>
          <a href="#sobre-nosotros" className="hover:text-amber-300 transition-colors">
            Sobre el Canal
          </a>
        </nav>

        {/* Social Links & Creator Portal CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-neutral-800">
            <a
              href="https://www.youtube.com/@LosPollitosTejen"
              target="_blank"
              rel="noreferrer"
              title="YouTube (@LosPollitosTejen)"
              className="p-2 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <YoutubeIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/LosPollitosTejen"
              target="_blank"
              rel="noreferrer"
              title="Facebook (/LosPollitosTejen)"
              className="p-2 rounded-xl text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/lospollitostejen"
              target="_blank"
              rel="noreferrer"
              title="Instagram (@lospollitostejen)"
              className="p-2 rounded-xl text-neutral-400 hover:text-pink-400 hover:bg-pink-500/10 transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.tiktok.com/@lospollitostejen"
              target="_blank"
              rel="noreferrer"
              title="TikTok (@lospollitostejen)"
              className="p-2 rounded-xl text-neutral-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 text-xs font-bold text-amber-300 shadow-sm transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Panel Creador</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400"
          >
            <Shield className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-5 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-neutral-300">
            <a
              href="#videos"
              onClick={() => setIsOpen(false)}
              className="hover:text-amber-300"
            >
              Tutoriales
            </a>
            <a
              href="#mascotas"
              onClick={() => setIsOpen(false)}
              className="hover:text-amber-300"
            >
              Mascotas 🐱🐶
            </a>
            <a
              href="#prendas"
              onClick={() => setIsOpen(false)}
              className="hover:text-amber-300"
            >
              Prendas & Gorros
            </a>
            <a
              href="#shorts"
              onClick={() => setIsOpen(false)}
              className="hover:text-amber-300"
            >
              Shorts & Tips
            </a>
            <a
              href="#sobre-nosotros"
              onClick={() => setIsOpen(false)}
              className="hover:text-amber-300"
            >
              Sobre el Canal
            </a>
          </nav>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                href="https://www.youtube.com/@LosPollitosTejen"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-neutral-900 text-red-400"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/LosPollitosTejen"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-neutral-900 text-blue-400"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/lospollitostejen"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-neutral-900 text-pink-400"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@lospollitostejen"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-neutral-900 text-cyan-400"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>

            <Link
              href="/login"
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              Acceso Administrador →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
