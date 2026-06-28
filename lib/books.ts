export async function getBooks() {
  const res = await fetch("/api/books");
  if (!res.ok) return [];
  return res.json();
}

export async function getBookById(id: number) {
  const res = await fetch(`/api/books/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getCurrentBookClubPick() {
  const res = await fetch("/api/books/current");
  if (!res.ok) return null;
  return res.json();
}

export async function getPastBookClubSelections() {
  const res = await fetch("/api/books/past");
  if (!res.ok) return [];
  return res.json();
}