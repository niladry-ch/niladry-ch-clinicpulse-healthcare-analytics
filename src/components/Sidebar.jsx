import {
  Upload,
  LayoutDashboard,
  FileText,
  Settings,
  AlertTriangle,
  Activity,
  Brain,
  Users,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  page,
  setPage,
  themeMode,
  setThemeMode,
  handleLogout,
}) {
  return (
    <aside className="sidebar">
      <h1>ClinicPulse</h1>
      <p>Healthcare Intelligence Platform</p>

      <button
        className={page === "dashboard" ? "active" : ""}
        onClick={() => setPage("dashboard")}
      >
        <LayoutDashboard size={18} /> Dashboard
      </button>

      <button
        className={page === "claims" ? "active" : ""}
        onClick={() => setPage("claims")}
      >
        <AlertTriangle size={18} /> Claims Intelligence
      </button>

      <button
        className={page === "revenue" ? "active" : ""}
        onClick={() => setPage("revenue")}
      >
        <FileText size={18} /> Revenue Intelligence
      </button>

      <button
        className={page === "clinical" ? "active" : ""}
        onClick={() => setPage("clinical")}
      >
        <Activity size={18} /> Clinical Analytics
      </button>

      <button
        className={page === "predictive" ? "active" : ""}
        onClick={() => setPage("predictive")}
      >
        <Brain size={18} /> Predictive Analytics
      </button>

      <button
        className={page === "population" ? "active" : ""}
        onClick={() => setPage("population")}
      >
        <Users size={18} /> Population Health
      </button>

      <button
        className={page === "upload" ? "active" : ""}
        onClick={() => setPage("upload")}
      >
        <Upload size={18} /> Upload Data
      </button>

      <button
        className={page === "reports" ? "active" : ""}
        onClick={() => setPage("reports")}
      >
        <FileText size={18} /> Reports
      </button>

      <button
        className={page === "settings" ? "active" : ""}
        onClick={() => setPage("settings")}
      >
        <Settings size={18} /> Settings
      </button>

      <button
        className="theme-toggle"
        onClick={() =>
          setThemeMode((currentMode) =>
            currentMode === "light" ? "dark" : "light"
          )
        }
      >
        {themeMode === "light" ? <Moon size={18} /> : <Sun size={18} />}
        {themeMode === "light" ? "Dark Mode" : "Light Mode"}
      </button>


      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        <LogOut size={18} /> Logout
      </button>

    </aside>
  );
}