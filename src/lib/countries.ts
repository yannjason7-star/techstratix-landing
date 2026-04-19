export const COUNTRIES = [
  { name: "Cameroun", code: "CM", prefix: "+237", flag: "🇨🇲", length: 9, placeholder: "6XXXXXXXX" },
  { name: "Gabon", code: "GA", prefix: "+241", flag: "🇬🇦", length: 8, placeholder: "7XXXXXXX" },
  { name: "Sénégal", code: "SN", prefix: "+221", flag: "🇸🇳", length: 9, placeholder: "7XXXXXXXX" },
  { name: "Côte d'Ivoire", code: "CI", prefix: "+225", flag: "🇨🇮", length: 10, placeholder: "0XXXXXXXXX" },
  { name: "France", code: "FR", prefix: "+33", flag: "🇫🇷", length: 9, placeholder: "6XXXXXXXX" },
  { name: "Autre", code: "XX", prefix: "+", flag: "🌍", length: 15, placeholder: "Numéro" },
].sort((a, b) => a.name.localeCompare(b.name));

export const CM_CITIES = ["Douala", "Yaoundé", "Garoua", "Bafoussam", "Maroua", "Bamenda", "Autre"];