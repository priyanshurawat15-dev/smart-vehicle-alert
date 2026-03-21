export function generateUniqueCode(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `VEH-${timestamp}-${randomStr}`.toUpperCase();
}

export function getQRCodeUrl(qrCode: string): string {
  const baseUrl = window.location.origin;
  const scanUrl = `${baseUrl}/scan/${qrCode}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(scanUrl)}`;
}

export function getScanUrl(qrCode: string): string {
  return `${window.location.origin}/scan/${qrCode}`;
}
