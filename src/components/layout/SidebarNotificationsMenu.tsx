import React, { useState, useRef, useEffect } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import {
  Bell,
  MessageSquare,
  Columns,
  Check,
  Trash2,
  CheckCircle2,
  X,
  Radio,
} from 'lucide-react';

interface SidebarNotificationsMenuProps {
  isExpanded?: boolean;
}

export const SidebarNotificationsMenu: React.FC<SidebarNotificationsMenuProps> = ({
  isExpanded = false,
}) => {
  const {
    pushNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    navigate,
  } = useHelpdesk();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = pushNotifications.filter((n) => !n.read).length;

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notif: (typeof pushNotifications)[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.type === 'kanban_task_assigned') {
      navigate('/helpdesk/inbox');
    } else if (notif.type === 'whatsapp_message') {
      navigate('/helpdesk/inbox');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* Trigger Button - positioned directly above profile icon */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-xl flex items-center transition cursor-pointer group relative ${
          isExpanded
            ? 'w-full px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800 gap-2.5'
            : 'w-10 h-10 justify-center text-slate-400 hover:text-white hover:bg-slate-800'
        } ${isOpen ? 'bg-slate-800 text-white ring-1 ring-slate-700' : ''}`}
        title={`Notificações push (${unreadCount} novas)`}
      >
        <div className="relative shrink-0 flex items-center justify-center">
          <Bell className="w-4 h-4 text-slate-300 group-hover:scale-110 transition group-hover:text-amber-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>

        {isExpanded && (
          <div className="flex-1 flex items-center justify-between min-w-0 text-left">
            <span className="text-xs font-medium text-slate-200">Notificações</span>
            {unreadCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                {unreadCount} nova{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute left-full bottom-0 ml-3 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col text-xs animate-in fade-in zoom-in-95 duration-150 select-none">
          {/* Header */}
          <div className="p-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white text-xs">Notificações Push</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-indigo-600 text-white">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsAsRead}
                  className="p-1 rounded-md text-[10px] text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                  title="Marcar todas como lidas"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
              {pushNotifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  className="p-1 rounded-md text-[10px] text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                  title="Limpar histórico"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80 p-1">
            {pushNotifications.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30 text-emerald-400" />
                <p className="text-xs">Nenhuma notificação no momento</p>
                <p className="text-[10px] text-slate-600 mt-0.5">Tudo em dia por aqui!</p>
              </div>
            ) : (
              pushNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-2.5 rounded-xl flex items-start gap-2.5 transition cursor-pointer hover:bg-slate-800/70 ${
                    !notif.read ? 'bg-indigo-950/25 border-l-2 border-indigo-500' : ''
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      notif.type === 'whatsapp_message'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                        : notif.type === 'kanban_task_assigned'
                        ? 'bg-indigo-950/80 text-indigo-400 border border-indigo-800/60'
                        : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                    }`}
                  >
                    {notif.type === 'whatsapp_message' ? (
                      <MessageSquare className="w-3.5 h-3.5" />
                    ) : notif.type === 'kanban_task_assigned' ? (
                      <Columns className="w-3.5 h-3.5" />
                    ) : (
                      <Radio className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-semibold text-white truncate">
                        {notif.title}
                      </span>
                      <span className="text-[9px] text-slate-500 shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.body}
                    </p>
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
