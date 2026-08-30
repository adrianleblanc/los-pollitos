import { Settings as SettingsIcon, Users, Key, Database, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Configuración del Workspace
        </h2>
        <p className="text-xs text-neutral-400">
          Ajustes generales, equipo y variables de integración
        </p>
      </div>

      <div className="space-y-6">
        {/* Workspace Info */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-neutral-800">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Información del Canal / Workspace</h3>
              <p className="text-xs text-neutral-400">Datos públicos de la marca</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Nombre del Workspace
              </label>
              <input
                type="text"
                defaultValue="Los Pollitos"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Slug / Identificador
              </label>
              <input
                type="text"
                defaultValue="los-pollitos"
                disabled
                className="w-full bg-neutral-950/50 border border-neutral-800/60 rounded-xl px-4 py-2 text-xs text-neutral-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Roles & Team */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Equipo y Permisos</h3>
                <p className="text-xs text-neutral-400">Roles asignados (Owner, Admin, Editor, Viewer)</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                LP
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Propietario Principal</p>
                <p className="text-[11px] text-neutral-400">admin@lospollitos.com</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              OWNER
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
