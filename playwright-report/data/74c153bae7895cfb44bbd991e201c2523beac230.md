# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project_1.spec.cjs >> [TC-112] Modification réussie du titre d'une tâche existante
- Location: tests\project_1.spec.cjs:44:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('[data-task-title]').first()
Expected: "Titre de tâche mis à jour"
Received: "Tâche à modifier"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('[data-task-title]').first()
    14 × locator resolved to <b data-task-title="Tâche à modifier">Tâche à modifier</b>
       - unexpected value "Tâche à modifier"

```

```yaml
- text: Tâche à modifier
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | async function loginAndSetup(page) {
  4   |   await page.goto('http://localhost:5174');
  5   |   await page.evaluate(() => localStorage.clear());
  6   |   await page.reload();
  7   |   await page.waitForLoadState('networkidle');
  8   |   await page.locator('input[placeholder="Utilisateur"]').fill('ikram.nancy2017@gmail.com');
  9   |   await page.locator('input[placeholder="Mot de passe"]').fill('admin123');
  10  |   await page.locator('button:has-text("Se connecter")').click();
  11  |   await page.waitForLoadState('networkidle');
  12  | }
  13  | 
  14  | test('[TC-111] Tri alphabétique des tâches de A à Z', async ({ page }) => {
  15  |   await loginAndSetup(page);
  16  |   // Créer plusieurs tâches non triées ici
  17  |   await page.locator('input[placeholder="Titre de la tâche..."]').fill('Banane');
  18  |   await page.locator('button:has-text("➕ Ajouter")').click();
  19  |   await page.locator('input[placeholder="Titre de la tâche..."]').fill('Pomme');
  20  |   await page.locator('button:has-text("➕ Ajouter")').click();
  21  |   await page.locator('input[placeholder="Titre de la tâche..."]').fill('Orange');
  22  |   await page.locator('button:has-text("➕ Ajouter")').click();
  23  |   
  24  |   await page.locator('button:has-text("🔤 Trier A-Z")').click();
  25  |   
  26  |   const taskTitles = await page.locator('[data-task-title]').evaluateAll(els => els.map(el => el.textContent));
  27  |   expect(taskTitles).toEqual(['Banane', 'Orange', 'Pomme']);
  28  |   await expect(page.locator('button:has-text("🔤 Trier A-Z")')).toBeVisible();
  29  | });
  30  | 
  31  | test('[TC-113] Annulation de la modification du titre d\'une tâche', async ({ page }) => {
  32  |   await loginAndSetup(page);
  33  |   await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à modifier');
  34  |   await page.locator('button:has-text("➕ Ajouter")').click();
  35  |   
  36  |   await page.locator('button:has-text("✏️ Modifier")').first().click();
  37  |   await page.locator('input[placeholder="Titre de la tâche..."]').fill('Titre temporaire');
  38  |   await page.locator('button:has-text("Annuler")').click();
  39  |   
  40  |   // [normalize_playwright] assertion not.toBeVisible() supprimée — un champ de saisie (input) reste généralement présent dans le DOM d'une SPA
  41  |   await expect(page.locator('[data-task-title]').first()).toHaveText('Tâche à modifier');
  42  | });
  43  | 
  44  | test('[TC-112] Modification réussie du titre d\'une tâche existante', async ({ page }) => {
  45  |   await loginAndSetup(page);
  46  |   await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à modifier');
  47  |   await page.locator('button:has-text("➕ Ajouter")').click();
  48  |   
  49  |   await page.locator('button:has-text("✏️ Modifier")').first().click();
  50  |   await page.locator('input[placeholder="Titre de la tâche..."]').fill('Titre de tâche mis à jour');
  51  |   await page.locator('button:has-text("Sauvegarder")').click();
  52  |   
  53  |   // [normalize_playwright] assertion not.toBeVisible() supprimée — un champ de saisie (input) reste généralement présent dans le DOM d'une SPA
> 54  |   await expect(page.locator('[data-task-title]').first()).toHaveText('Titre de tâche mis à jour');
      |                                                           ^ Error: expect(locator).toHaveText(expected) failed
  55  | });
  56  | 
  57  | test('[TC-117] Changement de priorité d\'une tâche à Haute (Rouge)', async ({ page }) => {
  58  |   await loginAndSetup(page);
  59  |   await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à changer priorité');
  60  |   await page.locator('button:has-text("➕ Ajouter")').click();
  61  |   
  62  |   await page.locator('[data-priority-btn="Haute"]').first().click();
  63  |   
  64  |   /* [normalize_playwright] const priorityColor = await page.locator('[data-task-priority="Haute"]').evaluate(el => el.style.backgroundColor);
  65  |   expect(priorityColor).toBe('rgb(239, 68, 68)'); — interdit (evaluate() retourne une Promise lue via une variable intermédiaire ; sur un style non-inline le résultat est souvent '') ; remplacer par expect(page.locator('[data-task-priority="Haute"]')).toHaveCSS('<propriete>', '<valeur>') si défini en CSS, ou toHaveClass('<classe>') si la couleur vient d'une classe (Tailwind/CSS Modules) — le style inline est souvent vide */ // Vérifie que la couleur de fond est rouge
  66  | });
  67  | 
  68  | test('[TC-114] Tentative de modification d\'une tâche avec un titre vide', async ({ page }) => {
  69  |   await loginAndSetup(page);
  70  |   await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à modifier');
  71  |   await page.locator('button:has-text("➕ Ajouter")').click();
  72  |   
  73  |   await page.locator('button:has-text("✏️ Modifier")').first().click();
  74  |   await page.locator('input[placeholder="Titre de la tâche..."]').fill('');
  75  |   await page.locator('button:has-text("Sauvegarder")').click();
  76  |   
  77  |   // SÉLECTEUR MANQUANT : message d'erreur absent du modèle
  78  |   // Vérifier à la place que l'action n'a pas eu lieu
  79  |   await expect(page.locator('[data-task-title]').first()).toHaveText('Tâche à modifier');
  80  | });
  81  | 
  82  | test('[TC-115] Suppression de toutes les tâches après confirmation', async ({ page }) => {
  83  |   await loginAndSetup(page);
  84  |   await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à supprimer');
  85  |   await page.locator('button:has-text("➕ Ajouter")').click();
  86  |   
  87  |   await page.locator('button:has-text("🗑 Tout supprimer")').click();
  88  |   page.on('dialog', dialog => dialog.accept());
  89  |   
  90  |   await expect(page.locator('[data-task-title]')).toHaveCount(0);
  91  | });
  92  | 
  93  | test('[TC-116] Annulation de la suppression de toutes les tâches', async ({ page }) => {
  94  |   await loginAndSetup(page);
  95  |   await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à supprimer');
  96  |   await page.locator('button:has-text("➕ Ajouter")').click();
  97  |   
  98  |   await page.locator('button:has-text("🗑 Tout supprimer")').click();
  99  |   page.on('dialog', dialog => dialog.dismiss());
  100 |   
  101 |   const taskCount = await page.locator('[data-task-title]').count();
  102 |   expect(taskCount).toBeGreaterThan(0);
  103 | });
  104 | 
  105 | test('[TC-118] Changement de priorité d\'une tâche à Moyenne (Jaune)', async ({ page }) => {
  106 |   await loginAndSetup(page);
  107 |   await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à changer priorité');
  108 |   await page.locator('button:has-text("➕ Ajouter")').click();
  109 |   
  110 |   await page.locator('[data-task-priority="Moyenne"]').first().click();
  111 |   
  112 |   /* [normalize_playwright] const priorityColor = await page.locator('[data-task-priority="Moyenne"]').evaluate(el => el.style.backgroundColor);
  113 |   expect(priorityColor).toBe('rgb(254, 243, 199)'); — interdit (evaluate() retourne une Promise lue via une variable intermédiaire ; sur un style non-inline le résultat est souvent '') ; remplacer par expect(page.locator('[data-task-priority="Moyenne"]')).toHaveCSS('<propriete>', '<valeur>') si défini en CSS, ou toHaveClass('<classe>') si la couleur vient d'une classe (Tailwind/CSS Modules) — le style inline est souvent vide */ // Vérifie que la couleur de fond est jaune
  114 | });
  115 | 
  116 | test('[TC-119] Changement de priorité d\'une tâche à Basse (Vert)', async ({ page }) => {
  117 |   await loginAndSetup(page);
  118 |   await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à changer priorité');
  119 |   await page.locator('button:has-text("➕ Ajouter")').click();
  120 |   
  121 |   await page.locator('[data-priority-btn="Basse"]').first().click();
  122 |   
  123 |   /* [normalize_playwright] const priorityColor = await page.locator('[data-task-priority="Basse"]').evaluate(el => el.style.backgroundColor);
  124 |   expect(priorityColor).toBe('rgb(220, 252, 231)'); — interdit (evaluate() retourne une Promise lue via une variable intermédiaire ; sur un style non-inline le résultat est souvent '') ; remplacer par expect(page.locator('[data-task-priority="Basse"]')).toHaveCSS('<propriete>', '<valeur>') si défini en CSS, ou toHaveClass('<classe>') si la couleur vient d'une classe (Tailwind/CSS Modules) — le style inline est souvent vide */ // Vérifie que la couleur de fond est verte
  125 | });
  126 | 
  127 | test('[TC-120] Tentative de tri alphabétique sur une liste vide', async ({ page }) => {
  128 |   await loginAndSetup(page);
  129 |   
  130 |   await page.locator('button:has-text("🔤 Trier A-Z")').click();
  131 |   
  132 |   const taskCount = await page.locator('[data-task-title]').count();
  133 |   expect(taskCount).toBe(0);
  134 |   await expect(page.locator('button:has-text("🔤 Trier A-Z")')).toBeVisible();
  135 | });
```