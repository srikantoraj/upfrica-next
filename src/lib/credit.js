//src/lib/credit.js
export async function getDashboardTasks() {
  const r = await fetch("/api/dashboard/tasks/");
  if (!r.ok) throw new Error("Failed to load tasks");
  return r.json();
}
export async function verifyGhanaCard(file) {
  const fd = new FormData();
  fd.append("card_image", file);
  const r = await fetch("/api/verify-id/", { method: "POST", body: fd });
  return r.json();
}