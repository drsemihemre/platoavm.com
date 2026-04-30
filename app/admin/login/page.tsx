import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Yönetim Girişi",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-stone-50 py-12">
      <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-stone-900">Yönetim Paneli</h1>
          <p className="text-sm text-stone-500 mt-1">İçerik yönetimi için giriş yapın</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
