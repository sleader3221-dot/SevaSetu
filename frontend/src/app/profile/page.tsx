import ProfileWizard from "@/components/ProfileWizard";

export const metadata = {
  title: "Citizen Assessment | SevaSetu",
  description: "Interactive Indian welfare eligibility navigator with live state map and official DynamoDB scheme matching"
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <ProfileWizard />
      </div>
    </div>
  );
}
