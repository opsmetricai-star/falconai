import { requireUser } from "@/lib/session";
import { Card, inputCls } from "@/components/dash";
import { updateProfile } from "../actions";

export const metadata = { title: "Settings" };

export default async function Settings() {
  const { profile } = await requireUser();
  return (
    <>
      <h1 className="display mb-6 text-3xl font-extrabold">Settings</h1>
      <Card title="Profile">
        <form action={updateProfile} className="grid max-w-lg gap-3">
          <input value={profile.email ?? ""} disabled className={`${inputCls} bg-soft`} aria-label="Email" />
          <input name="full_name" defaultValue={profile.full_name ?? ""} placeholder="Full name" className={inputCls} />
          <input name="company" defaultValue={profile.company ?? ""} placeholder="Company" className={inputCls} />
          <button className="btn-red w-fit px-6 py-2 text-sm">Save</button>
        </form>
      </Card>
      <Card title="Password">
        <p className="text-sm text-muted">Use <a href="/forgot-password" className="text-red underline">password recovery</a> to change your password.</p>
      </Card>
    </>
  );
}
