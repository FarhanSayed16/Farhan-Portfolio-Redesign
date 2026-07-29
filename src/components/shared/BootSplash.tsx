import './bootSplash.css';

/** First paint while device mode resolves. Mobile = modern dark; wide = XP blue. */
export default function BootSplash() {
  return (
    <div className="boot-splash" role="status" aria-live="polite" aria-label="Loading">
      <div className="boot-splash-xp">
        <div className="xp-boot-logo-container">
          <div className="xp-boot-logo">
            <span className="xp-boot-ms">Farhan</span>
            <span className="xp-boot-win">OS</span>
            <sup className="xp-boot-xp">XP</sup>
          </div>
        </div>
        <div className="xp-boot-loader">
          <div className="xp-boot-loader-bar">
            <div className="xp-boot-loader-blocks">
              <span className="xp-block" />
              <span className="xp-block" />
              <span className="xp-block" />
              <span className="xp-block" />
              <span className="xp-block" />
              <span className="xp-block" />
            </div>
          </div>
        </div>
      </div>
      <div className="boot-splash-modern">
        <div className="boot-splash-grid" aria-hidden />
        <div className="boot-splash-mark" aria-hidden>
          <span className="boot-splash-mark-f">F</span>
          <span className="boot-splash-ring" />
          <span className="boot-splash-ring boot-splash-ring-2" />
          <span className="boot-splash-ring boot-splash-ring-3" />
        </div>
        <div className="boot-splash-text">
          <p className="boot-splash-brand">INITIALIZING</p>
          <p className="boot-splash-sub">FARHAN OS v3.0</p>
        </div>
        <div className="boot-splash-bar-container" aria-hidden>
          <div className="boot-splash-bar">
            <span className="boot-splash-bar-fill" />
          </div>
          <span className="boot-splash-bar-glow" />
        </div>
      </div>
    </div>
  );
}
