function sortNumber(a: number, b: number): number {
  if (!a || !b) {
    return 0;
  }

  return a - b;
}

function sortText(a: string, b: string): number {
  return a.localeCompare(b);
}

function sortDateFromString(a: string, b: string): number {
  if (!a || !b) {
    return 0;
  }

  const dateA = new Date(a);
  const dateB = new Date(b);

  if (dateA === dateB) {
    return 0;
  }

  return new Date(a) > new Date(b) ? 1 : -1;
}

export { sortText, sortNumber, sortDateFromString };
