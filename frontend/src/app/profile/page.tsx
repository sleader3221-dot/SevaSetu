import ProfileWizard from "@/components/ProfileWizard";

export const metadata = {
  title: 'Profile | SevaSetu',
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Let's Find Your Benefits</h1>
          <p className="text-lg text-gray-600">Complete this quick profile to discover schemes you are eligible for.</p>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-12">
          <ProfileWizard />
        </div>
      </div>
    </div>
  );
}
