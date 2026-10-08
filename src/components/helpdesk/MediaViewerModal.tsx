import React from 'react';
import { X, Download, ExternalLink, Image, FileText, Music } from 'lucide-react';
import { MediaItem } from '../../types';

interface MediaViewerModalProps {
  media: MediaItem | null;
  onClose: () => void;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ media, onClose }) => {
  if (!media) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {media.type === 'image' && <Image className="w-4 h-4 text-emerald-400 shrink-0" />}
            {media.type === 'document' && <FileText className="w-4 h-4 text-blue-400 shrink-0" />}
            {media.type === 'audio' && <Music className="w-4 h-4 text-amber-400 shrink-0" />}
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white truncate">{media.title}</h3>
              <p className="text-[10px] text-slate-400">
                Enviado por <strong className="text-slate-300">{media.senderName}</strong> às {media.createdAt} • {media.size || '1.2 MB'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={media.url}
              download={media.title}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition text-xs flex items-center gap-1.5 px-2.5 font-medium"
              title="Baixar arquivo"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-950/50 min-h-[300px]">
          {media.type === 'image' && (
            <img
              src={media.url}
              alt={media.title}
              className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain shadow-md border border-slate-800"
            />
          )}

          {media.type === 'document' && (
            <div className="text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{media.title}</h4>
                <p className="text-xs text-slate-400 mt-1">Documento técnico anexado ao atendimento</p>
              </div>
              <a
                href={media.url}
                target="_blank"
                rel="noreferrer"
                download={media.title}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Abrir / Baixar Documento</span>
              </a>
            </div>
          )}

          {media.type === 'audio' && (
            <div className="text-center p-8 space-y-4 w-full max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
                <Music className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{media.title}</h4>
                <p className="text-xs text-slate-400 mt-1">Mensagem de voz gravada no atendimento</p>
              </div>
              <audio controls className="w-full mt-3 rounded-lg" src={media.url}>
                Seu navegador não suporta a reprodução deste áudio.
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
