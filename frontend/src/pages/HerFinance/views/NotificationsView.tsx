import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  Trash2,
  CheckCheck,
  Settings2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Sliders
} from 'lucide-react';
import { useHerFinance } from '../../../context/HerFinanceContext';
import { useToast } from '../../../context/ToastContext';
import { NotificationItem, UserPreferences } from '../../../types/finance';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    clearAllNotifications,
    preferences,
    updatePreferences
  } = useHerFinance();

  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'unread' | 'alerts'>('all');

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'unread') return !item.isRead;
    if (filter === 'alerts') return item.type === 'budget_limit' || item.type === 'budget_warning';
    return true;
  });

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.isRead) markNotificationAsRead(n.id);
    });
    showToast('All notifications marked as read', 'success');
  };

  const handleTogglePreference = (key: keyof UserPreferences) => {
    const currentVal = preferences[key];
    if (typeof currentVal === 'boolean') {
      updatePreferences({ [key]: !currentVal });
      showToast(`Preference updated: ${String(key)} is now ${!currentVal ? 'enabled' : 'disabled'}`, 'info');
    }
  };

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'budget_limit':
        return <AlertOctagon className="w-5 h-5 text-rose-600" />;
      case 'budget_warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'goal_achieved':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'goal_reminder':
        return <Calendar className="w-5 h-5 text-teal-600" />;
      case 'monthly_summary':
      case 'info':
      default:
        return <Bell className="w-5 h-5 text-teal-600" />;
    }
  };

  const getBorderForType = (type: NotificationItem['type'], isRead: boolean) => {
    if (isRead) return 'border-slate-200 bg-white';
    switch (type) {
      case 'budget_limit':
        return 'border-rose-300 bg-rose-50/40';
      case 'budget_warning':
        return 'border-amber-300 bg-amber-50/40';
      case 'goal_achieved':
        return 'border-emerald-300 bg-emerald-50/40';
      case 'goal_reminder':
      case 'monthly_summary':
      case 'info':
      default:
        return 'border-teal-300 bg-teal-50/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Notifications & Autonomous Alerts</h2>
            {unreadNotificationsCount > 0 && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadNotificationsCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time threshold breaches, monthly reconciliations, and savings milestones
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'unread' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Unread ({unreadNotificationsCount})
            </button>
            <button
              onClick={() => setFilter('alerts')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'alerts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Budget Warnings
            </button>
          </div>

          {unreadNotificationsCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Mark all read</span>
            </button>
          )}

          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            title="Clear all notifications"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Notifications List & Alert Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Notifications Stream */}
        <div className="lg:col-span-2 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">All clear! No notifications</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your spending is safely within category limits, and no warning thresholds have been triggered.
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (!item.isRead) markNotificationAsRead(item.id);
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-sm ${getBorderForType(
                  item.type,
                  item.isRead
                )}`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-white shadow-2xs shrink-0 border border-slate-100">
                    {getIconForType(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>{item.title}</span>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                        )}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium shrink-0">
                        {item.date}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>

                    {item.category && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                          Category: {item.category}
                        </span>
                        {item.type === 'budget_limit' && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                            100% Limit Reached
                          </span>
                        )}
                        {item.type === 'budget_warning' && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                            80% Warning Threshold
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Col: Autonomous Alert Rules & Policy Settings */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Autonomous Alert Rules</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* 80% Threshold */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-800 block">80% Budget Warning Limit</span>
                  <span className="text-slate-500 text-[11px]">
                    Alert me as soon as any category reaches 80% utilization.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifyAt80Percent}
                  onChange={() => handleTogglePreference('notifyAt80Percent')}
                  className="w-4 h-4 text-teal-600 rounded-md focus:ring-teal-500 cursor-pointer mt-0.5"
                />
              </div>

              {/* 100% Threshold */}
              <div className="flex items-start justify-between gap-3 pt-3 border-t border-slate-100">
                <div>
                  <span className="font-bold text-slate-800 block">100% Hard Ceiling Breach</span>
                  <span className="text-slate-500 text-[11px]">
                    Immediate critical alert when a category budget is fully exhausted.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifyAt100Percent}
                  onChange={() => handleTogglePreference('notifyAt100Percent')}
                  className="w-4 h-4 text-teal-600 rounded-md focus:ring-teal-500 cursor-pointer mt-0.5"
                />
              </div>

              {/* Weekly/Monthly Digest */}
              <div className="flex items-start justify-between gap-3 pt-3 border-t border-slate-100">
                <div>
                  <span className="font-bold text-slate-800 block">Monthly Inflow / Outflow Digest</span>
                  <span className="text-slate-500 text-[11px]">
                    Summary statement of monthly expenses and highest merchant spenders.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.monthlySummaryEmail}
                  onChange={() => handleTogglePreference('monthlySummaryEmail')}
                  className="w-4 h-4 text-teal-600 rounded-md focus:ring-teal-500 cursor-pointer mt-0.5"
                />
              </div>

              {/* Savings Milestone Reminders */}
              <div className="flex items-start justify-between gap-3 pt-3 border-t border-slate-100">
                <div>
                  <span className="font-bold text-slate-800 block">Savings Goal Pacing</span>
                  <span className="text-slate-500 text-[11px]">
                    Notify when contributions fall behind monthly target pace.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.goalDeadlinesAlert}
                  onChange={() => handleTogglePreference('goalDeadlinesAlert')}
                  className="w-4 h-4 text-teal-600 rounded-md focus:ring-teal-500 cursor-pointer mt-0.5"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600 inline mr-1" />
              Notifications are processed completely on-device in your secure browser sandbox.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
