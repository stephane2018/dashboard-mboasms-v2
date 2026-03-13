import { CountryCodeWarning } from "@/shared/common/country-code-warning"

export default function ContactsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contacts</h1>
      <CountryCodeWarning />
      <p className="mt-4">Manage your contacts here</p>
    </div>
  );
}
