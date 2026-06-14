import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [selectedLogs, setSelectedLogs] = useState(""); // Conservé si besoin futur
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // AUTHENTIFICATION
  // =========================
  const login = () => {
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Identifiants incorrects");
    }
  };

  // =========================
  // LOCALSTORAGE — Chargement
  // =========================
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // =========================
  // LOCALSTORAGE — Sauvegarde
  // =========================
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // =========================
  // AJOUTER TÂCHE
  // =========================
  const addTask = () => {
    if (!title.trim()) return;

    // Validation anti-doublon
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
        createdAt: new Date().toLocaleString(),
      },
    ]);

    setTitle("");
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
  // FILTRE PAR STATUT + RECHERCHE
  // =========================
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "All" || task.status === filter;
    return matchesSearch && matchesFilter;
  });

  // =========================
  // COULEUR PRIORITÉ
  // =========================
  const priorityColor = (priority) => {
    if (priority === "Haute") return "#fee2e2";
    if (priority === "Basse") return "#dcfce7";
    return "#fef3c7";
  };

  // -------------------------------------------------------------
  // ÉCRAN DE CONNEXION (Si non authentifié)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div style={{ padding: "40px", maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
        <h2>Connexion</h2>
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
          style={{ ...inputStyle, width: "100%", marginBottom: "15px" }}
        />
        <button onClick={login} style={{ ...btnPrimary, width: "100%" }}>
          Se connecter
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ÉCRAN PRINCIPAL (Si authentifié)
  // -------------------------------------------------------------
  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>QA Task Manager</h1>

      {/* COMPTEUR */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <span>Total : {tasks.length}</span>
        <span>✅ Terminées : {tasks.filter((t) => t.status === "Done").length}</span>
        <span>📋 À faire : {tasks.filter((t) => t.status === "Todo").length}</span>
      </div>

      {/* AJOUTER */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Titre tâche"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          style={inputStyle}
        />
        <button onClick={addTask} style={btnPrimary}>
          Ajouter
        </button>
      </div>

      {/* RECHERCHE */}
      <input
        type="text"
        placeholder="Rechercher tâche..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ ...inputStyle, marginBottom: "15px", width: "100%" }}
      />

      {/* FILTRES */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" }}>
        {["All", "Todo", "Done"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...btnFilter,
              background: filter === f ? "#2563eb" : "#e2e8f0",
              color: filter === f ? "white" : "#334155",
            }}
          >
            {f}
          </button>
        ))}
        <button onClick={sortTasks} style={btnFilter}>
          🔤 Trier A-Z
        </button>
        <button onClick={clearTasks} style={{ ...btnFilter, background: "#fee2e2", color: "#991b1b" }}>
          🗑 Tout supprimer
        </button>
      </div>

      <hr />

      {/* LISTE */}
      {filteredTasks.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>Aucune tâche trouvée</p>
      ) : (
        filteredTasks.map((task) => (
          <div
            key={task.id}
            style={{
              marginBottom: "12px",
              padding: "15px",
              borderRadius: "14px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {/* TITRE / EDIT */}
            {editId === task.id ? (
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={inputStyle}
                />
                <button onClick={saveEdit} style={btnPrimary}>
                  Sauvegarder
                </button>
                <button onClick={() => setEditId(null)} style={btnFilter}>
                  Annuler
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <b
                    style={{
                      textDecoration: task.status === "Done" ? "line-through" : "none",
                      color: task.status === "Done" ? "#94a3b8" : "#0f172a",
                    }}
                  >
                    {task.title}
                  </b>
                  <small style={{ marginLeft: "10px", color: "#94a3b8" }}>
                    {task.createdAt}
                  </small>
                </div>

                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    background: task.status === "Done" ? "#dcfce7" : "#fef3c7",
                    color: task.status === "Done" ? "#166534" : "#92400e",
                    fontSize: "13px",
                  }}
                >
                  {task.status}
                </span>
              </div>
            )}

            {/* PRIORITÉ */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "#64748b" }}>Priorité :</span>
              {["Haute", "Moyenne", "Basse"].map((p) => (
                <button
                  key={p}
                  onClick={() => changePriority(task.id, p)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    background: task.priority === p ? priorityColor(p) : "#e2e8f0",
                    fontWeight: task.priority === p ? "700" : "400",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* ACTIONS */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => toggleStatus(task.id)} style={btnFilter}>
                {task.status === "Todo" ? "✅ Terminer" : "↩ Rouvrir"}
              </button>
              <button onClick={() => startEdit(task)} style={btnFilter}>
                ✏️ Modifier
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                style={{ ...btnFilter, background: "#fee2e2", color: "#991b1b" }}
              >
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