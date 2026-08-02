import { User, KeyRound, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function SettingsPanel({
  editProfileName,
  setEditProfileName,
  editProfileEmail,
  setEditProfileEmail,
  profileSuccessMsg,
  handleUpdateProfile,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  pwdError,
  pwdSuccessMsg,
  handlePasswordReset,
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border/20 p-5">
          <User className="h-5 w-5 text-ink-accent" />
          <h3 className="text-sm font-bold uppercase tracking-wide">Admin Profile</h3>
        </div>
        <CardContent className="p-6">
          {profileSuccessMsg && (
            <div className="mb-4 flex items-center gap-1.5 rounded-xl border border-emerald/20 bg-emerald/10 p-3 text-xs font-semibold text-emerald">
              <Check className="h-4 w-4" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Admin Name
              </label>
              <Input
                value={editProfileName}
                onChange={(e) => setEditProfileName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Email Address
              </label>
              <Input
                type="email"
                value={editProfileEmail}
                onChange={(e) => setEditProfileEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="h-11 w-full">
              Save Profile Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border/20 p-5">
          <KeyRound className="h-5 w-5 text-ink-accent" />
          <h3 className="text-sm font-bold uppercase tracking-wide">Security Reset</h3>
        </div>
        <CardContent className="p-6">
          {pwdError && (
            <div className="mb-4 flex items-center gap-1.5 rounded-xl border border-[var(--c-peach)]/30 bg-[var(--c-peach)]/25 p-3 text-xs text-ink-accent">
              <AlertCircle className="h-4 w-4" />
              <span>{pwdError}</span>
            </div>
          )}
          {pwdSuccessMsg && (
            <div className="mb-4 flex items-center gap-1.5 rounded-xl border border-emerald/20 bg-emerald/10 p-3 text-xs font-semibold text-emerald">
              <Check className="h-4 w-4" />
              <span>{pwdSuccessMsg}</span>
            </div>
          )}
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Current Password
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="h-11 w-full">
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
