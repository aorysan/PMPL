import { test, expect } from '@playwright/test';

test('TC_RU_031 - Tambah Ruangan', async ({ page }) => {
    // Langkah 1: Buka halaman login (jika belum login)
    await page.goto('https://sipasti.rakaiseto.com/login');

    // Langkah 2: Isi form login
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'sipasti123');
    await page.click('button[type="submit"]');

    // Langkah 3: Buka halaman kelola ruangan
    await page.goto('https://sipasti.rakaiseto.com/admin/ruangan');

    // Langkah 4: Klik tombol "Tambah Ruangan"
    await page.click('button:has-text("Tambah Ruangan")');
    await page.keyboard.press('Enter'); // Submit the search

    await page.waitForSelector('#addModal', { state: 'visible', timeout: 10000 });

    // Langkah 5: Isi form tambah ruangan
    await page.selectOption('#addidrole', 'Ruang Teori');
    await page.waitForSelector('input[placeholder="Masukkan Nama Ruangan"]', { state: 'visible' });
    await page.fill('input[placeholder="Masukkan Nama Ruangan"]', 'Ruang Teori 101');
    await page.selectOption('#addlantai', 'Lantai 5');
    await page.click('#addtambahRuangan button[type="submit"]');

    // Langkah 6: Verifikasi ruangan berhasil ditambahkan
    await page.waitForSelector('body', { hasText: 'Data Berhasil Ditambahkan' });
    const successNotification = await page.locator('body', { hasText: 'Data Berhasil Ditambahkan' });
    await expect(successNotification).toBeVisible({ timeout: 10000 });
});

test('TC_RU_040 - Cek Detail Ruangan', async ({ page }) => {
    // Langkah 1: Buka halaman login (jika belum login)
    await page.goto('https://sipasti.rakaiseto.com/login ');

    // Langkah 2: Login sebagai pengguna Civitas Akademik
    await page.locator('input[name="username"]').fill('admin');
    await page.locator('input[name="password"]').fill('sipasti123');
    await page.locator('button[type="submit"]').click();

    // Langkah 3: Buka halaman kelola ruangan
    await page.goto('https://sipasti.rakaiseto.com/admin/ruangan');

    // Langkah 4: Isi formulir pencarian
    await page.locator('#searchInput').fill('Ruang Teori 101');
    await page.keyboard.press('Enter'); // Submit the search

    // Langkah 5: Verifikasi hasil pencarian
    const searchResult = await page.locator('table', { hasText: 'Ruang Teori 101' });
    await expect(searchResult).toBeVisible({ timeout: 10000 });

    const detailButton = searchResult.locator('tr').filter({ hasText: 'Ruang Teori 101' }).first().locator('td').nth(4).locator('button').first();
    await expect(detailButton).toBeVisible({ timeout: 10000 });
    await detailButton.click();
});

test('TC_RU_042 - Edit ruangan', async ({ page }) => {
    // Langkah 1: Buka halaman login (jika belum login)
    await page.goto('https://sipasti.rakaiseto.com/login ');

    // Langkah 2: Login sebagai pengguna Civitas Akademik
    await page.locator('input[name="username"]').fill('admin');
    await page.locator('input[name="password"]').fill('sipasti123');
    await page.locator('button[type="submit"]').click();

    // Langkah 3: Buka halaman laporan
    await page.goto('https://sipasti.rakaiseto.com/admin/ruangan');

    // Langkah 4: Isi formulir pencarian
    await page.locator('#searchInput').fill('Ruang Teori 101');
    await page.keyboard.press('Enter'); // Submit the search

    // Langkah 5: Klik tombol "Edit" pada ruangan yang dicari
    const editButton = page.locator('table').locator('tr', { hasText: 'Ruang Teori 101' }).first().locator('td').nth(4).locator('button').nth(1);
    await expect(editButton).toBeVisible({ timeout: 10000 });
    await editButton.click();

    await page.waitForSelector('#editModal', { state: 'visible' }); // Wait for the modal to be visible
    await page.waitForSelector('#editFormRuangan', { state: 'visible' }); // Wait for the form to be visible

    // Use the form's ID for more reliable targeting
    await page.fill('input[id="editRuanganNama"]', 'Ruang Teori 102');
    await page.click('#editFormRuangan button[type="submit"]');
});

test('TC_RU_051 - Hapus Ruangan', async ({ page }) => {
    // Langkah 1: Buka halaman login (jika belum login)
    await page.goto('https://sipasti.rakaiseto.com/login ');

    // Langkah 2: Login sebagai pengguna Civitas Akademik
    await page.locator('input[name="username"]').fill('admin');
    await page.locator('input[name="password"]').fill('sipasti123');
    await page.locator('button[type="submit"]').click();

    // Langkah 3: Buka halaman laporan
    await page.goto('https://sipasti.rakaiseto.com/admin/ruangan');

    // Langkah 4: Isi formulir pencarian
    // Use a more precise locator and add explicit waits
    await page.locator('#searchInput').fill('102');
    await page.keyboard.press('Enter'); // Submit the search

    // Wait for the table to update with search results
    await page.waitForSelector('table', { state: 'visible' });

    // Use a more precise locator to find the delete button for the specific room
    const deleteButton = page.locator('table').locator('tr', { hasText: 'Ruang Teori 102' }).first().locator('td').nth(4).locator('button').nth(2);
    await expect(deleteButton).toBeVisible({ timeout: 10000 });
    await deleteButton.click();
});