// Types de QR codes supportes

export type QRCodeType = "url" | "wifi" | "vcard" | "email" | "sms" | "phone";

export const QR_CODE_TYPES: Record<QRCodeType, { label: string; description: string }> = {
  url: {
    label: "URL",
    description: "Lien vers un site web",
  },
  wifi: {
    label: "WiFi",
    description: "Connexion a un reseau WiFi",
  },
  vcard: {
    label: "vCard",
    description: "Fiche contact",
  },
  email: {
    label: "Email",
    description: "Envoyer un email",
  },
  sms: {
    label: "SMS",
    description: "Envoyer un SMS",
  },
  phone: {
    label: "Telephone",
    description: "Appeler un numero",
  },
};

// Interfaces pour les donnees de chaque type

export interface URLData {
  url: string;
}

export interface WiFiData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden?: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  company?: string;
  title?: string;
  website?: string;
  address?: string;
}

export interface EmailData {
  email: string;
  subject?: string;
  body?: string;
}

export interface SMSData {
  phone: string;
  message?: string;
}

export interface PhoneData {
  phone: string;
}

export type QRCodeData = URLData | WiFiData | VCardData | EmailData | SMSData | PhoneData;

// Fonctions de generation du contenu QR pour chaque type

/**
 * Genere le contenu QR pour une URL
 */
export function generateURLContent(data: URLData): string {
  return data.url;
}

/**
 * Genere le contenu QR pour un reseau WiFi
 * Format: WIFI:T:WPA;S:nomReseau;P:motdepasse;H:true;;
 */
export function generateWiFiContent(data: WiFiData): string {
  const parts = [
    `WIFI:`,
    `T:${data.encryption};`,
    `S:${escapeWiFiString(data.ssid)};`,
    `P:${escapeWiFiString(data.password)};`,
  ];

  if (data.hidden) {
    parts.push(`H:true;`);
  }

  parts.push(`;`);

  return parts.join("");
}

/**
 * Genere le contenu QR pour une vCard
 * Format vCard 3.0
 */
export function generateVCardContent(data: VCardData): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${data.lastName};${data.firstName};;;`,
    `FN:${data.firstName} ${data.lastName}`,
  ];

  if (data.company) {
    lines.push(`ORG:${data.company}`);
  }

  if (data.title) {
    lines.push(`TITLE:${data.title}`);
  }

  if (data.phone) {
    lines.push(`TEL;TYPE=CELL:${data.phone}`);
  }

  if (data.email) {
    lines.push(`EMAIL:${data.email}`);
  }

  if (data.website) {
    lines.push(`URL:${data.website}`);
  }

  if (data.address) {
    lines.push(`ADR:;;${data.address};;;;`);
  }

  lines.push("END:VCARD");

  return lines.join("\n");
}

/**
 * Genere le contenu QR pour un email
 * Format: mailto:email@example.com?subject=Sujet&body=Message
 */
export function generateEmailContent(data: EmailData): string {
  let content = `mailto:${data.email}`;

  const params: string[] = [];

  if (data.subject) {
    params.push(`subject=${encodeURIComponent(data.subject)}`);
  }

  if (data.body) {
    params.push(`body=${encodeURIComponent(data.body)}`);
  }

  if (params.length > 0) {
    content += `?${params.join("&")}`;
  }

  return content;
}

/**
 * Genere le contenu QR pour un SMS
 * Format: sms:+33600000000?body=Message
 */
export function generateSMSContent(data: SMSData): string {
  let content = `sms:${data.phone}`;

  if (data.message) {
    content += `?body=${encodeURIComponent(data.message)}`;
  }

  return content;
}

/**
 * Genere le contenu QR pour un appel telephonique
 * Format: tel:+33600000000
 */
export function generatePhoneContent(data: PhoneData): string {
  return `tel:${data.phone}`;
}

/**
 * Genere le contenu QR en fonction du type
 */
export function generateQRContent(type: QRCodeType, data: QRCodeData): string {
  switch (type) {
    case "url":
      return generateURLContent(data as URLData);
    case "wifi":
      return generateWiFiContent(data as WiFiData);
    case "vcard":
      return generateVCardContent(data as VCardData);
    case "email":
      return generateEmailContent(data as EmailData);
    case "sms":
      return generateSMSContent(data as SMSData);
    case "phone":
      return generatePhoneContent(data as PhoneData);
    default:
      throw new Error(`Type de QR code non supporte: ${type}`);
  }
}

/**
 * Echappe les caracteres speciaux pour le format WiFi
 */
function escapeWiFiString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/:/g, "\\:")
    .replace(/,/g, "\\,")
    .replace(/"/g, '\\"');
}

/**
 * Valide les donnees en fonction du type
 */
export function validateQRData(type: QRCodeType, data: QRCodeData): { valid: boolean; error?: string } {
  switch (type) {
    case "url": {
      const urlData = data as URLData;
      if (!urlData.url) {
        return { valid: false, error: "L'URL est requise" };
      }
      try {
        new URL(urlData.url);
      } catch {
        return { valid: false, error: "L'URL n'est pas valide" };
      }
      return { valid: true };
    }

    case "wifi": {
      const wifiData = data as WiFiData;
      if (!wifiData.ssid) {
        return { valid: false, error: "Le nom du reseau (SSID) est requis" };
      }
      if (wifiData.encryption !== "nopass" && !wifiData.password) {
        return { valid: false, error: "Le mot de passe est requis pour ce type de securite" };
      }
      return { valid: true };
    }

    case "vcard": {
      const vcardData = data as VCardData;
      if (!vcardData.firstName || !vcardData.lastName) {
        return { valid: false, error: "Le prenom et le nom sont requis" };
      }
      return { valid: true };
    }

    case "email": {
      const emailData = data as EmailData;
      if (!emailData.email) {
        return { valid: false, error: "L'adresse email est requise" };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailData.email)) {
        return { valid: false, error: "L'adresse email n'est pas valide" };
      }
      return { valid: true };
    }

    case "sms": {
      const smsData = data as SMSData;
      if (!smsData.phone) {
        return { valid: false, error: "Le numero de telephone est requis" };
      }
      return { valid: true };
    }

    case "phone": {
      const phoneData = data as PhoneData;
      if (!phoneData.phone) {
        return { valid: false, error: "Le numero de telephone est requis" };
      }
      return { valid: true };
    }

    default:
      return { valid: false, error: "Type de QR code non supporte" };
  }
}

/**
 * Retourne les champs par defaut pour un type de QR code
 */
export function getDefaultData(type: QRCodeType): QRCodeData {
  switch (type) {
    case "url":
      return { url: "" };
    case "wifi":
      return { ssid: "", password: "", encryption: "WPA" };
    case "vcard":
      return { firstName: "", lastName: "" };
    case "email":
      return { email: "" };
    case "sms":
      return { phone: "" };
    case "phone":
      return { phone: "" };
    default:
      return { url: "" };
  }
}
