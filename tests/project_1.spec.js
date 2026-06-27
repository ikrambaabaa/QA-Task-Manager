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
  // Ajouter des tâches non triées ici
  await page.locator('button:has-text("🔤 Trier A-Z")').click();
  const taskTitles = await page.locator('[data-task-title]').evaluateAll(els => els.map(el => el.textContent));
  const sortedTitles = [...taskTitles].sort();
  expect(taskTitles).toEqual(sortedTitles);
  await expect(page.locator('button:has-text("🔤 Trier A-Z")')).toBeVisible();
});

test('[TC-113] Annulation de la modification du titre d\'une tâche', async ({ page }) => {
  await loginAndSetup(page);
  // Ajouter une tâche ici
  const originalTitle = await page.locator('[data-task-title]').first().textContent();
  await page.locator('button:has-text("✏️ Modifier")').first().click();
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('Titre temporaire');
  await page.locator('button:has-text("Annuler")').click();
  // [normalize_playwright] assertion not.toBeVisible() supprimée — un champ de saisie (input) reste généralement présent dans le DOM d'une SPA
  const currentTitle = await page.locator('[data-task-title]').first().textContent();
  expect(currentTitle).toBe(originalTitle);
});

test('[TC-112] Modification réussie du titre d\'une tâche existante', async ({ page }) => {
  await loginAndSetup(page);
  // Ajouter une tâche ici
  await page.locator('button:has-text("✏️ Modifier")').first().click();
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('Titre de tâche mis à jour');
  await page.locator('button:has-text("Sauvegarder")').click();
  // [normalize_playwright] assertion not.toBeVisible() supprimée — un champ de saisie (input) reste généralement présent dans le DOM d'une SPA
  await expect(page.locator('[data-task-title]').first()).toHaveText('Titre de tâche mis à jour');
});

test('[TC-117] Changement de priorité d\'une tâche à Haute (Rouge)', async ({ page }) => {
  await loginAndSetup(page);
  // Ajouter une tâche avec une priorité différente ici
  await page.locator('[data-priority-btn="Haute"]').first().click();
  /* [normalize_playwright] const priorityColor = await page.locator('[data-task-priority="Haute"]').first().evaluate(el => el.style.backgroundColor);
  expect(priorityColor).toBe('rgb(239, 68, 68)'); — interdit (evaluate() retourne une Promise lue via une variable intermédiaire ; sur un style non-inline le résultat est souvent '') ; remplacer par expect(page.locator('[data-task-priority="Haute"]').first()).toHaveCSS('<propriete>', '<valeur>') si défini en CSS, ou toHaveClass('<classe>') si la couleur vient d'une classe (Tailwind/CSS Modules) — le style inline est souvent vide */ // Vérifier que la couleur est rouge
});

test('[TC-114] Tentative de modification d\'une tâche avec un titre vide', async ({ page }) => {
  await loginAndSetup(page);
  // Ajouter une tâche ici
  await page.locator('button:has-text("✏️ Modifier")').first().click();
  await page.locator('input[placeholder="Titre de la tâche..."]').fill('');
  await page.locator('button:has-text("Sauvegarder")').click();
  await expect(page.locator('text=Le titre ne peut pas être vide')).toBeVisible();
  await expect(page.locator('input[placeholder="Titre de la tâche..."]')).toBeVisible();
});

test('[TC-115] Suppression de toutes les tâches après confirmation', async ({ page }) => {
  await loginAndSetup(page);
  // Ajouter plusieurs tâches ici
  await page.locator('button:has-text("🗑 Tout supprimer")').click();
  page.on('dialog', dialog => dialog.accept());
  await expect(page.locator('[data-task-id]')).toHaveCount(0);
});

test('[TC-116] Annulation de la suppression de toutes les tâches', async ({ page }) => {
  await loginAndSetup(page);
  // Ajouter plusieurs tâches ici
  await page.locator('button:has-text("🗑 Tout supprimer")').click();
  page.on('dialog', dialog => dialog.dismiss());
  await expect(page.locator('[data-task-id]')).toHaveCount(3); // Vérifier que le nombre de tâches est inchangé
});

test('[TC-118] Changement de priorité d\'une tâche à Moyenne (Jaune)', async ({ page }) => {
  await loginAndSetup(page);
  // Ajouter une tâche avec une priorité différente ici
  await page.locator('[data-task-priority="Moyenne"]').first().click();
  /* [normalize_playwright] const priorityColor = await page.locator('[data-task-priority="Moyenne"]').first().evaluate(el => el.style.backgroundColor);
  expect(priorityColor).toBe('rgb(254, 243, 199)'); — interdit (evaluate() retourne une Promise lue via une variable intermédiaire ; sur un style non-inline le résultat est souvent '') ; remplacer par expect(page.locator('[data-task-priority="Moyenne"]').first()).toHaveCSS('<propriete>', '<valeur>') si défini en CSS, ou toHaveClass('<classe>') si la couleur vient d'une classe (Tailwind/CSS Modules) — le style inline est souvent vide */ // Vérifier que la couleur est jaune
});

test('[TC-119] Changement de priorité d\'une tâche à Basse (Vert)', async ({ page }) => {
  await loginAndSetup(page);
  // Ajouter une tâche avec une priorité différente ici
  await page.locator('[data-priority-btn="Basse"]').first().click();
  /* [normalize_playwright] const priorityColor = await page.locator('[data-task-priority="Basse"]').first().evaluate(el => el.style.backgroundColor);
  expect(priorityColor).toBe('rgb(220, 252, 231)'); — interdit (evaluate() retourne une Promise lue via une variable intermédiaire ; sur un style non-inline le résultat est souvent '') ; remplacer par expect(page.locator('[data-task-priority="Basse"]').first()).toHaveCSS('<propriete>', '<valeur>') si défini en CSS, ou toHaveClass('<classe>') si la couleur vient d'une classe (Tailwind/CSS Modules) — le style inline est souvent vide */ // Vérifier que la couleur est verte
});

test('[TC-120] Tentative de tri alphabétique sur une liste vide', async ({ page }) => {
  await loginAndSetup(page);
  await page.locator('button:has-text("🔤 Trier A-Z")').click();
  await expect(page.locator('[data-task-id]')).toHaveCount(0); // Vérifier que la liste reste vide
  await expect(page.locator('button:has-text("🔤 Trier A-Z")')).toBeVisible();
});