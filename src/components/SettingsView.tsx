import { useState } from 'react';

interface SettingsViewProps {
  onSimulateError: () => void;
}

export function SettingsView({ onSimulateError }: SettingsViewProps) {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  return (
    <div className="max-w-[1280px] mx-auto w-full p-4 space-y-6">
      <div>
        <h2 className="text-[20px] font-bold text-on-surface mb-1">Settings</h2>
        <p className="text-[14px] text-on-surface-variant">Manage your account and app preferences.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-bold text-[20px]">
          LA
        </div>
        <div className="flex-grow">
          <h3 className="text-[16px] font-bold text-on-surface">EduFinance Admin</h3>
          <p className="text-[14px] text-on-surface-variant">admin@edufinance.org</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <h3 className="text-[14px] font-semibold text-on-surface-variant px-4 py-3 bg-surface-container-low border-b border-outline-variant">
          Preferences
        </h3>
        
        <div className="flex items-center justify-between p-4 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            <div>
              <p className="text-[14px] font-semibold text-on-surface">Push Notifications</p>
              <p className="text-[12px] text-on-surface-variant">Receive alerts on mobile device.</p>
            </div>
          </div>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${notifications ? 'bg-primary' : 'bg-surface-variant border border-outline'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">mail</span>
            <div>
              <p className="text-[14px] font-semibold text-on-surface">Email Alerts</p>
              <p className="text-[12px] text-on-surface-variant">Receive daily summary reports.</p>
            </div>
          </div>
          <button 
            onClick={() => setEmailAlerts(!emailAlerts)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${emailAlerts ? 'bg-primary' : 'bg-surface-variant border border-outline'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute ${emailAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <button 
        onClick={onSimulateError}
        className="w-full bg-surface-container-high text-on-surface font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-surface-variant transition-all flex items-center justify-center gap-2 mt-4 border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      >
        <span className="material-symbols-outlined text-[20px]">warning</span>
        Simulate Data Error
      </button>

      <button className="w-full bg-error-container text-on-error-container font-bold py-3 px-6 rounded-xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-background">
        <span className="material-symbols-outlined text-[20px]">logout</span>
        Log Out
      </button>
    </div>
  );
}
