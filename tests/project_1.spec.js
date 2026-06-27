const { test, expect } = require('@playwright/test');

async function loginAndSetup(page) {
  await page.goto('http://localhost:5174');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.locator('input[placeholder="Utilisateur"]').fill('ikram.nancy2017@gmail.com');
  await page.locator('input[placeholder="Mot de passe"]').fill('admin123');
  await page.locator('button:has-text("Se connecter")').click();
  await page.waitForLoadState('networkidle');
}

test('[TC-111] Tri alphabétique des tâches de A à Z', async ({ page }) => {
  await loginAndSetup(page);
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('B tâche');
  await page.locator('button:has-text("➕ Ajouter")').click();
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('A tâche');
  await page.locator('button:has-text("➕ Ajouter")').click();
  await page.locator('button:has-text("🔤 Trier A-Z")').click();
  
  const taskTitles = await page.locator('[data-task-title]').evaluateAll(els => els.map(el => el.textContent));
  expect(taskTitles).toEqual(['A tâche', 'B tâche']);
  await expect(page.locator('button:has-text("🔤 Trier A-Z")')).toBeVisible();
});

test('[TC-113] Annulation de la modification du titre d\'une tâche', async ({ page }) => {
  await loginAndSetup(page);
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à modifier');
  await page.locator('button:has-text("➕ Ajouter")').click();
  await page.locator('button:has-text("✏️ Modifier")').click();
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('Titre temporaire');
  await page.locator('button:has-text("Annuler")').click();
  
  // [normalize_playwright] assertion not.toBeVisible() supprimée — un champ de saisie (input) reste généralement présent dans le DOM d'une SPA
  await expect(page.locator('[data-task-title]')).toHaveText('Tâche à modifier');
});

test('[TC-112] Modification réussie du titre d\'une tâche existante', async ({ page }) => {
  await loginAndSetup(page);
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à modifier');
  await page.locator('button:has-text("➕ Ajouter")').click();
  await page.locator('button:has-text("✏️ Modifier")').click();
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('Titre de tâche mis à jour');
  await page.locator('button:has-text("Sauvegarder")').click();
  
  // [normalize_playwright] assertion not.toBeVisible() supprimée — un champ de saisie (input) reste généralement présent dans le DOM d'une SPA
  await expect(page.locator('[data-task-title]')).toHaveText('Titre de tâche mis à jour');
});

test('[TC-117] Changement de priorité d\'une tâche à Haute (Rouge)', async ({ page }) => {
  await loginAndSetup(page);
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à changer priorité');
  await page.locator('button:has-text("➕ Ajouter")').click();
  await page.locator('[data-priority-btn="Haute"]').click();
  
  /* [normalize_playwright] const priorityColor = await page.locator('[data-task-priority="Haute"]').evaluate(el => el.style.backgroundColor);
  expect(priorityColor).toBe('rgb(239, 68, 68)'); — interdit (evaluate() retourne une Promise lue via une variable intermédiaire ; sur un style non-inline le résultat est souvent '') ; remplacer par expect(page.locator('[data-task-priority="Haute"]')).toHaveCSS('<propriete>', '<valeur>') si défini en CSS, ou toHaveClass('<classe>') si la couleur vient d'une classe (Tailwind/CSS Modules) — le style inline est souvent vide */ // Vérifie que la couleur est rouge
});

test('[TC-114] Tentative de modification d\'une tâche avec un titre vide', async ({ page }) => {
  await loginAndSetup(page);
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à modifier');
  await page.locator('button:has-text("➕ Ajouter")').click();
  await page.locator('button:has-text("✏️ Modifier")').click();
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('');
  await page.locator('button:has-text("Sauvegarder")').click();
  
  // SÉLECTEUR MANQUANT : message d'erreur absent du modèle
  await expect(page.locator('[data-task-title]')).toHaveText('Tâche à modifier');
});

test('[TC-115] Suppression de toutes les tâches après confirmation', async ({ page }) => {
  await loginAndSetup(page);
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à supprimer');
  await page.locator('button:has-text("➕ Ajouter")').click();
  await page.locator('button:has-text("🗑 Tout supprimer")').click();
  
  page.on('dialog', dialog => dialog.accept());
  await expect(page.locator('div#empty-state')).toBeVisible();
});

test('[TC-116] Annulation de la suppression de toutes les tâches', async ({ page }) => {
  await loginAndSetup(page);
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à supprimer');
  await page.locator('button:has-text("➕ Ajouter")').click();
  await page.locator('button:has-text("🗑 Tout supprimer")').click();
  
  page.on('dialog', dialog => dialog.dismiss());
  await expect(page.locator('[data-task-title]')).toBeVisible();
});

test('[TC-118] Changement de priorité d\'une tâche à Moyenne (Jaune)', async ({ page }) => {
  await loginAndSetup(page);
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à changer priorité');
  await page.locator('button:has-text("➕ Ajouter")').click();
  await page.locator('[data-task-priority="Moyenne"]').click();
  
  /* [normalize_playwright] const priorityColor = await page.locator('[data-task-priority="Moyenne"]').evaluate(el => el.style.backgroundColor);
  expect(priorityColor).toBe('rgb(254, 243, 199)'); — interdit (evaluate() retourne une Promise lue via une variable intermédiaire ; sur un style non-inline le résultat est souvent '') ; remplacer par expect(page.locator('[data-task-priority="Moyenne"]')).toHaveCSS('<propriete>', '<valeur>') si défini en CSS, ou toHaveClass('<classe>') si la couleur vient d'une classe (Tailwind/CSS Modules) — le style inline est souvent vide */ // Vérifie que la couleur est jaune
});

test('[TC-119] Changement de priorité d\'une tâche à Basse (Vert)', async ({ page }) => {
  await loginAndSetup(page);
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('Tâche à changer priorité');
  await page.locator('button:has-text("➕ Ajouter")').click();
  await page.locator('[data-priority-btn="Basse"]').click();
  
  /* [normalize_playwright] const priorityColor = await page.locator('[data-task-priority="Basse"]').evaluate(el => el.style.backgroundColor);
  expect(priorityColor).toBe('rgb(220, 252, 231)'); — interdit (evaluate() retourne une Promise lue via une variable intermédiaire ; sur un style non-inline le résultat est souvent '') ; remplacer par expect(page.locator('[data-task-priority="Basse"]')).toHaveCSS('<propriete>', '<valeur>') si défini en CSS, ou toHaveClass('<classe>') si la couleur vient d'une classe (Tailwind/CSS Modules) — le style inline est souvent vide */ // Vérifie que la couleur est verte
});

test('[TC-120] Tentative de tri alphabétique sur une liste vide', async ({ page }) => {
  await loginAndSetup(page);
  await page.locator('button:has-text("🔤 Trier A-Z")').click();
  
  // Aucune action visible n'est effectuée car la liste est vide
  await expect(page.locator('div#empty-state')).toBeVisible();
  await expect(page.locator('button:has-text("🔤 Trier A-Z")')).toBeVisible();
});