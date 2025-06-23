export const currencies = [
  { code: "USD", label: "USD", flag: "US" },
  { code: "IQD", label: "IQD", flag: "IQ" },
  { code: "EUR", label: "EUR", flag: "EU" },
];

export const applications = [
  { value: "ACC", label: { ar: "المحاسبة", en: "Accounting" } },
  { value: "HRMS", label: { ar: "إدارة الموارد البشرية", en: "Human Resource" } },
  { value: "SCM", label: { ar: "إدارة سلسلة التوريد", en: "Supply Chain Management" } },
];

export const permissions = [
  { value: 3, label: { ar: "المحاسبة", en: "Accounting" } },
  { value: 2, label: { ar: "إدارة الموارد البشرية", en: "Human Resource" } },
  { value: 4, label: { ar: "إدارة سلسلة التوريد", en: "Supply Chain Management" } },
  { value: 5, label: { ar: "إدارة الحسابات", en: "Account Management" } },
];

export const roles = [
  { value: 1, label: { ar: "قراءة فقط", en: "Read Only" } },
  { value: 2, label: { ar: "مدير", en: "Manager" } },
  { value: 3, label: { ar: "لا شيء", en: "None" } },
  { value: 5, label: { ar: "عامل", en: "Worker" } },
];
