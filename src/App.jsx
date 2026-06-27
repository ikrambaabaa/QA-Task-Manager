import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // ✅ Auth persistée dans localStorage — survive au reload
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("auth") === "true"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // AUTHENTIFICATION
  // =========================
  const login = () => {
    if (username === "ikram.nancy2017@gmail.com" && password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true");
    } else {
      alert("Identifiants incorrects");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  // =========================
  // LOCALSTORAGE — Chargement
  // =========================
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
    const savedDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDark);
  }, []);

  // =========================
  // LOCALSTORAGE — Sauvegarde tâches
  // =========================
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // =========================
  // LOCALSTORAGE — Sauvegarde dark mode
  // =========================
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // =========================
  // AJOUTER TÂCHE
  // =========================
  const addTask = () => {
    if (!title.trim()) return;

    if (tasks.some((task) => task.title.toLowerCase() === title.toLowerCase())) {
      alert("Tâche déjà existante");
      return;
    }

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title,
        status: "Todo",
        priority: "Moyenne",
        dueDate: dueDate || null,
        createdAt: new Date().toLocaleString(),
      },
    ]);

    setTitle("");
    setDueDate("");
  };

  // =========================
  // SUPPRIMER avec confirmation
  // =========================
  const deleteTask = (id) => {
    if (window.confirm("Supprimer cette tâche ?")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  // =========================
  // SUPPRIMER TOUT
  // =========================
  const clearTasks = () => {
    if (window.confirm("Supprimer toutes les tâches ?")) {
      setTasks([]);
    }
  };

  // =========================
  // TOGGLE STATUT
  // =========================
  const toggleStatus = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "Todo" ? "Done" : "Todo" }
          : task
      )
    );
  };

  // =========================
  // MODIFIER TÂCHE
  // =========================
  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = () => {
    if (!editTitle.trim()) return;
    setTasks(
      tasks.map((task) =>
        task.id === editId ? { ...task, title: editTitle } : task
      )
    );
    setEditId(null);
    setEditTitle("");
  };

  // =========================
  // CHANGER PRIORITÉ
  // =========================
  const changePriority = (id, priority) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, priority } : task))
    );
  };

  // =========================
  // TRI ALPHABÉTIQUE
  // =========================
  const sortTasks = () => {
    setTasks([...tasks].sort((a, b) => a.title.localeCompare(b.title)));
  };

  // =========================
  // EXPORT JSON
  // =========================
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // =========================
  // FILTRE PAR STATUT + RECHERCHE + PRIORITÉ
  // =========================
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || task.status === filter;
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
    return matchesSearch && matchesFilter && matchesPriority;
  });

  // =========================
  // COULEUR PRIORITÉ
  // =========================
  const priorityColor = (priority) => {
    if (priority === "Haute") return "#fee2e2";
    if (priority === "Basse") return "#dcfce7";
    return "#fef3c7";
  };

  // =========================
  // VÉRIFIER DATE ÉCHÉANCE
  // =========================
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  // =========================
  // COMPTEURS PRIORITÉS
  // =========================
  const hauteCount = tasks.filter((t) => t.priority === "Haute").length;
  const moyenneCount = tasks.filter((t) => t.priority === "Moyenne").length;
  const basseCount = tasks.filter((t) => t.priority === "Basse").length;

  // =========================
  // THÈME
  // =========================
  const theme = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    card: darkMode ? "#1e293b" : "white",
    text: darkMode ? "#f1f5f9" : "#0f172a",
    border: darkMode ? "#334155" : "#e2e8f0",
    subtext: darkMode ? "#94a3b8" : "#64748b",
    input: darkMode ? "#1e293b" : "white",
  };

  // -------------------------------------------------------------
  // ÉCRAN DE CONNEXION
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div style={{
        padding: "40px",
        maxWidth: "400px",
        margin: "50px auto",
        textAlign: "center",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
      }}>
        <h2>🔐 Connexion</h2>
        <input
          type="text"
          placeholder="Utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ ...inputStyle, width: "100%", marginBottom: "15px" }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          style={{ ...inputStyle, width: "100%", marginBottom: "15px" }}
        />
        <button onClick={login} style={{ ...btnPrimary, width: "100%" }}>
          Se connecter
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ÉCRAN PRINCIPAL
  // -------------------------------------------------------------
  return (
    <div style={{
      padding: "30px",
      maxWidth: "850px",
      margin: "0 auto",
      background: theme.bg,
      minHeight: "100vh",
      color: theme.text
    }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <h1 style={{ margin: 0, color: theme.text }}>📋 QA Task Manager</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={exportJSON} style={{ ...btnFilter, background: "#dbeafe", color: "#2563eb" }}>
            📥 Export JSON
          </button>
          <button onClick={() => setDarkMode(!darkMode)} style={{ ...btnFilter, background: darkMode ? "#fef3c7" : "#1e293b", color: darkMode ? "#92400e" : "white" }}>
            {darkMode ? "☀️ Clair" : "🌙 Sombre"}
          </button>
          <button onClick={logout} style={{ ...btnFilter, background: "#fee2e2", color: "#991b1b" }}>
            🚪 Déconnexion
          </button>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "25px", flexWrap: "wrap" }}>
        {[
          { label: "Total", value: tasks.length, color: "#dbeafe", text: "#1d4ed8" },
          { label: "✅ Terminées", value: tasks.filter((t) => t.status === "Done").length, color: "#dcfce7", text: "#166534" },
          { label: "📋 À faire", value: tasks.filter((t) => t.status === "Todo").length, color: "#fef3c7", text: "#92400e" },
          { label: "🔴 Haute", value: hauteCount, color: "#fee2e2", text: "#991b1b" },
          { label: "🟡 Moyenne", value: moyenneCount, color: "#fef3c7", text: "#92400e" },
          { label: "🟢 Basse", value: basseCount, color: "#dcfce7", text: "#166534" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: stat.color,
            color: stat.text,
            padding: "10px 18px",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "14px"
          }}>
            {stat.label} : {stat.value}
          </div>
        ))}
      </div>

      {/* AJOUTER */}
      <div style={{ background: theme.card, padding: "20px", borderRadius: "16px", marginBottom: "20px", border: `1px solid ${theme.border}` }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Titre de la tâche..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            style={{ ...inputStyle, background: theme.input, color: theme.text, flex: 2 }}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ ...inputStyle, background: theme.input, color: theme.text, flex: 1 }}
          />
          <button onClick={addTask} style={btnPrimary}>
            ➕ Ajouter
          </button>
        </div>
      </div>

      {/* RECHERCHE + FILTRES */}
      <div style={{ background: theme.card, padding: "20px", borderRadius: "16px", marginBottom: "20px", border: `1px solid ${theme.border}` }}>
        <input
          type="text"
          placeholder="🔍 Rechercher une tâche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, width: "100%", marginBottom: "12px", background: theme.input, color: theme.text }}
        />

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["All", "Todo", "Done"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              ...btnFilter,
              background: filter === f ? "#2563eb" : theme.border,
              color: filter === f ? "white" : theme.text,
            }}>
              {f}
            </button>
          ))}

          <div style={{ width: "1px", background: theme.border }} />

          {["All", "Haute", "Moyenne", "Basse"].map((p) => (
            <button key={p} onClick={() => setPriorityFilter(p)} style={{
              ...btnFilter,
              background: priorityFilter === p ? "#7c3aed" : theme.border,
              color: priorityFilter === p ? "white" : theme.text,
            }}>
              {p}
            </button>
          ))}

          <div style={{ width: "1px", background: theme.border }} />

          <button onClick={sortTasks} style={{ ...btnFilter, background: theme.border, color: theme.text }}>
            🔤 Trier A-Z
          </button>
          <button onClick={clearTasks} style={{ ...btnFilter, background: "#fee2e2", color: "#991b1b" }}>
            🗑 Tout supprimer
          </button>
        </div>
      </div>

      {/* LISTE */}
      {filteredTasks.length === 0 ? (
        <div id="empty-state" style={{ textAlign: "center", padding: "40px", color: theme.subtext }}>
          <p style={{ fontSize: "40px" }}>📭</p>
          <p>Aucune tâche trouvée</p>
        </div>
      ) : (
        filteredTasks.map((task) => (
          <div
            key={task.id}
            data-task-id={task.id}
            style={{
              marginBottom: "12px",
              padding: "16px",
              borderRadius: "14px",
              background: theme.card,
              border: `1px solid ${isOverdue(task.dueDate) && task.status !== "Done" ? "#ef4444" : theme.border}`,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}>

            {/* TITRE / EDIT */}
            {editId === task.id ? (
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  data-edit-input="true"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ ...inputStyle, background: theme.input, color: theme.text }}
                />
                <button onClick={saveEdit} style={btnPrimary}>Sauvegarder</button>
                <button onClick={() => setEditId(null)} style={{ ...btnFilter, background: theme.border, color: theme.text }}>Annuler</button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <b
                    data-task-title={task.title}
                    style={{
                      textDecoration: task.status === "Done" ? "line-through" : "none",
                      color: task.status === "Done" ? theme.subtext : theme.text,
                      fontSize: "15px"
                    }}>
                    {task.title}
                  </b>
                  <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                    <small style={{ color: theme.subtext }}>{task.createdAt}</small>
                    {task.dueDate && (
                      <small style={{ color: isOverdue(task.dueDate) && task.status !== "Done" ? "#ef4444" : theme.subtext }}>
                        📅 {task.dueDate} {isOverdue(task.dueDate) && task.status !== "Done" ? "⚠️ En retard" : ""}
                      </small>
                    )}
                  </div>
                </div>
                <span
                  data-task-status={task.status}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    background: task.status === "Done" ? "#dcfce7" : "#fef3c7",
                    color: task.status === "Done" ? "#166534" : "#92400e",
                    fontSize: "13px",
                    fontWeight: "600"
                  }}>
                  {task.status}
                </span>
              </div>
            )}

            {/* PRIORITÉ */}
            {/* ✅ FIX : data-task-priority ajouté pour exposer la priorité actuelle au DOM */}
            <div data-task-priority={task.priority} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: theme.subtext }}>Priorité :</span>
              {["Haute", "Moyenne", "Basse"].map((p) => (
                <button
                  key={p}
                  data-priority-btn={p}
                  onClick={() => changePriority(task.id, p)}
                  style={{
                    padding: "3px 12px",
                    borderRadius: "20px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    background: task.priority === p ? priorityColor(p) : theme.border,
                    color: theme.text,
                    fontWeight: task.priority === p ? "700" : "400",
                  }}>
                  {p}
                </button>
              ))}
            </div>

            {/* ACTIONS */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                data-action="toggle"
                onClick={() => toggleStatus(task.id)}
                style={{ ...btnFilter, background: task.status === "Todo" ? "#dcfce7" : "#fef3c7", color: task.status === "Todo" ? "#166534" : "#92400e" }}>
                {task.status === "Todo" ? "✅ Terminer" : "↩ Rouvrir"}
              </button>
              <button
                data-action="edit"
                onClick={() => startEdit(task)}
                style={{ ...btnFilter, background: "#dbeafe", color: "#2563eb" }}>
                ✏️ Modifier
              </button>
              <button
                data-action="delete"
                onClick={() => deleteTask(task.id)}
                style={{ ...btnFilter, background: "#fee2e2", color: "#991b1b" }}>
                🗑 Supprimer
              </button>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

/* STYLES */
const inputStyle = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "14px",
  flex: 1,
};

const btnPrimary = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

const btnFilter = {
  background: "#e2e8f0",
  color: "#334155",
  border: "none",
  padding: "8px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "13px",
};

export default App;