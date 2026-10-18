import React, { useState } from 'react';
import {
  X,
  Monitor,
  Apple,
  Layers,
  Download,
  CheckCircle2,
  HardDrive,
  Cpu,
  WifiOff,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const DesktopAppModal = () => {
  const { isDesktopModalOpen, setIsDesktopModalOpen } = useProject();
  const [downloadingPlatform, setDownloadingPlatform] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  if (!isDesktopModalOpen) return null;

  const handleStartDownload = (platform) => {
    setDownloadingPlatform(platform);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1a14]/80 backdrop-blur-md animate-fadeIn select-none"
      onClick={() => setIsDesktopModalOpen(false)}
    >
      <div
        className="w-full max-w-md bg-stone-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-500/30 p-6 text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-emerald-glow">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Get Pulse PM Desktop</h3>
              <p className="text-[10px] text-emerald-300 font-mono">v4.0 Native Client</p>
            </div>
          </div>
          <button
            onClick={() => setIsDesktopModalOpen(false)}
            className="p-1 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-300 mb-4 leading-relaxed">
          Install the standalone native desktop application for uninterrupted productivity, offline
          local sync, and zero browser tab clutter.
        </p>

        {/* Feature Pills */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <WifiOff className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] text-stone-300 block font-medium">Offline Sync</span>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <Cpu className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
            <span className="text-[10px] text-stone-300 block font-medium">60 FPS Native</span>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <HardDrive className="w-3.5 h-3.5 text-teal-400 mx-auto mb-1" />
            <span className="text-[10px] text-stone-300 block font-medium">Local SQLite</span>
          </div>
        </div>

        {/* Platform Download List */}
        <div className="space-y-2.5 mb-5">
          {/* Windows */}
          <div
            onClick={() => handleStartDownload('Windows')}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/40 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Windows 10 / 11
                </div>
                <div className="text-[10px] text-stone-400">Setup Installer (.exe, 64-bit)</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-stone-400 group-hover:text-emerald-400 transition-colors" />
          </div>

          {/* macOS */}
          <div
            onClick={() => handleStartDownload('macOS')}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/40 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <Apple className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  macOS (Apple Silicon & Intel)
                </div>
                <div className="text-[10px] text-stone-400">Universal Disk Image (.dmg)</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-stone-400 group-hover:text-emerald-400 transition-colors" />
          </div>

          {/* Linux */}
          <div
            onClick={() => handleStartDownload('Linux')}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/40 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Linux (.AppImage / .deb)
                </div>
                <div className="text-[10px] text-stone-400">Universal 64-bit Package</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-stone-400 group-hover:text-emerald-400 transition-colors" />
          </div>
        </div>

        {/* Download Progress Toast */}
        {downloadingPlatform && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium text-emerald-300">
              <span>
                {downloadProgress < 100
                  ? `Downloading PulsePM for ${downloadingPlatform}...`
                  : `Installer Ready for ${downloadingPlatform}!`}
              </span>
              <span className="font-mono">{downloadProgress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-200"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
            {downloadProgress === 100 && (
              <p className="text-[11px] text-stone-300 mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Launch the installer to activate your standalone desktop app.</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
