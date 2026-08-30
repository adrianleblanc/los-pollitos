"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Edit,
  CheckCircle2,
  AlertCircle,
  X,
  Play,
  Film,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, FacebookIcon, TikTokIcon } from "@/components/ui/icons";

interface CalendarItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  scheduledFor?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  primaryMedia?: string | null;
  customMetadata?: any;
}

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/calendar");
      if (res.ok) {
        const data = await res.json();
        setItems(data.contents || []);
      }
    } catch (err) {
      console.error("Error loading calendar items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  // Adjust so Monday is 0, Sunday is 6
  const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getItemsForDay = (day: number) => {
    return items.filter((item) => {
      const targetDateStr = item.scheduledFor || item.publishedAt || item.createdAt;
      if (!targetDateStr) return false;
      const d = new Date(targetDateStr);
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === day
      );
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      case "SCHEDULED":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "READY":
        return "bg-amber-500/10 border-amber-500/30 text-amber-300";
      default:
        return "bg-neutral-800/80 border-neutral-700 text-neutral-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Calendario Editorial & Programación
          </h2>
          <p className="text-xs text-neutral-400">
            Cronograma visual de publicaciones automatizadas con Inngest
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-white min-w-[130px] text-center">
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/admin/content/new"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Programar Post</span>
          </Link>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 overflow-hidden shadow-xl">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          <div>Lun</div>
          <div>Mar</div>
          <div>Mié</div>
          <div>Jue</div>
          <div>Vie</div>
          <div>Sáb</div>
          <div>Dom</div>
        </div>

        {/* Month days cells */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty previous month slots */}
          {Array.from({ length: adjustedFirstDay }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="min-h-[110px] rounded-2xl bg-neutral-950/30 border border-neutral-900/40 p-2 opacity-30"
            />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayItems = getItemsForDay(day);
            const isToday =
              new Date().getDate() === day &&
              new Date().getMonth() === month &&
              new Date().getFullYear() === year;

            return (
              <div
                key={`day-${day}`}
                className={`min-h-[110px] rounded-2xl p-2.5 transition-all flex flex-col justify-between border ${
                  isToday
                    ? "bg-amber-500/5 border-amber-500/40 shadow-inner"
                    : "bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? "bg-amber-400 text-neutral-950 font-black"
                        : "text-neutral-300"
                    }`}
                  >
                    {day}
                  </span>

                  {dayItems.length > 0 && (
                    <span className="text-[9px] font-mono text-neutral-500">
                      {dayItems.length} {dayItems.length === 1 ? "post" : "posts"}
                    </span>
                  )}
                </div>

                {/* Day Items List */}
                <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[70px]">
                  {dayItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`w-full text-left p-1.5 rounded-xl border text-[10px] font-semibold truncate transition-all cursor-pointer block ${getStatusColor(
                        item.status
                      )}`}
                    >
                      <div className="flex items-center gap-1">
                        <YoutubeIcon className="w-2.5 h-2.5 fill-red-400 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Item Detail Drawer / Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(selectedItem.status)}`}>
                {selectedItem.status}
              </span>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedItem.primaryMedia && (
              <div className="relative aspect-video rounded-2xl bg-neutral-950 overflow-hidden border border-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedItem.primaryMedia}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-white mb-1">
                {selectedItem.title}
              </h3>
              {selectedItem.description && (
                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                  {selectedItem.description}
                </p>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs space-y-2 text-neutral-400">
              <div className="flex justify-between">
                <span>Canal de Destino:</span>
                <span className="text-red-400 font-semibold">
                  {selectedItem.customMetadata?.youtube?.targetChannel === "TESTING_ADRIAN"
                    ? "@AdrianLeblancMorales (Pruebas)"
                    : "@LosPollitosTejen"}
                </span>
              </div>
              {selectedItem.scheduledFor && (
                <div className="flex justify-between">
                  <span>Fecha Programada:</span>
                  <span className="text-amber-400 font-mono">
                    {new Date(selectedItem.scheduledFor).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Link
                href={`/admin/content/${selectedItem.id}/edit`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Editar Publicación</span>
              </Link>
              <button
                onClick={() => setSelectedItem(null)}
                className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
