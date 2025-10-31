// File: tests/e2e/laporan.test.js
import { test, expect } from '@playwright/test';


test('TC_BUAT_001 - Membuat laporan kerusakan', async ({ page }) => {
  // Langkah 1: Buka halaman login (jika belum login)
  await page.goto('https://sipasti.rakaiseto.com/login');

  // Langkah 2: Login sebagai pengguna Civitas Akademik
  await page.locator('input[name="username"]').fill('civitas');
  await page.locator('input[name="password"]').fill('sipasti123');
  await page.locator('button[type="submit"]').click();

  // Langkah 3: Buka halaman buat laporan
  await page.goto('https://sipasti.rakaiseto.com/civitas/laporkan');

  // Langkah 4: Isi formulir laporan
  // Pilih Lantai
  const lantaiSelect = await page.locator('#lantaiSelect');
  await lantaiSelect.selectOption('5');

  // Tunggu dan pilih Ruang
  await page.waitForSelector('#div-ruang');
  const ruangSelect = await page.locator('#ruangSelect');
  await ruangSelect.selectOption('RT03 - 5'); // Ganti dengan ID ruang yang valid

  // Tunggu dan pilih Fasilitas
  await page.waitForSelector('#div-fasilitas');
  const fasilitasSelect = await page.locator('#fasilitasSelect');
  await fasilitasSelect.selectOption('AC - RT03'); // Ganti dengan ID fasilitas yang valid

  // Isi deskripsi
  await page.locator('#deskripsiInput').fill('Lampu tidak menyala');

  // Upload foto
  const fileInput = await page.locator('#fotoInput');
  await fileInput.setInputFiles('public/assets/image/1.jpg');

  // Langkah 5: Submit form
  const submitButton = await page.locator('button[type="submit"]:has-text("Kirim")');
  await submitButton.click();

  // Langkah 6: Verifikasi notifikasi sukses
  await page.waitForSelector('body', { hasText: 'Laporan terkirim' });
  const successNotification = await page.locator('body', { hasText: 'Laporan terkirim' });
  await expect(successNotification).toBeVisible({ timeout: 10000 });

  // Langkah 7: Verifikasi redirect ke dashboard
  await page.waitForNavigation();
  await expect(page).toHaveURL('https://sipasti.rakaiseto.com/civitas');
});

test('TC-CV-004 - Cek detail laporan kerusakan', async ({ page }) => {
  // Langkah 1: Buka halaman login (jika belum login)
  await page.goto('https://sipasti.rakaiseto.com/login ');

  // Langkah 2: Login sebagai pengguna Civitas Akademik
  await page.locator('input[name="username"]').fill('civitas');
  await page.locator('input[name="password"]').fill('sipasti123');
  await page.locator('button[type="submit"]').click();

  // Langkah 3: Buka halaman laporan
  await page.goto('https://sipasti.rakaiseto.com/civitas/status ');

  // Langkah 4: Isi formulir pencarian
  await page.locator('#searchInput').fill('AC');
  await page.keyboard.press('Enter'); // Submit the search

  // Langkah 5: Verifikasi hasil pencarian
  const searchResult = await page.locator('table', { hasText: 'AC' });
  await expect(searchResult).toBeVisible({ timeout: 10000 });

  // Langkah 6: Klik pada laporan untuk melihat detail
  await searchResult.locator('tr').filter({ hasText: 'AC' }).first().getByRole('button', { name: 'Detail' }).click();
});