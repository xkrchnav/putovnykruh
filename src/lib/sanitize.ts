export function sanitizeEmail(email: string): string {
  const normalized = email.toLowerCase().trim();
  const cleaned = normalized.replace(/['"\s,;|]/g, "");
  return cleaned;
}

export function sanitizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("420")) {
    return digits.slice(-9);
  }
  if (digits.startsWith("421")) {
    return digits.slice(-9);
  }
  if (digits.length === 9) {
    return digits;
  }
  return digits.slice(-9);
}

export function sanitizeContact(contact: string): string {
  const trimmed = contact.trim();
  if (trimmed.includes("@")) {
    return sanitizeEmail(trimmed);
  }
  return sanitizePhone(trimmed);
}