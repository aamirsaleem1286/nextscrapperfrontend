"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { toast } from "sonner";
import { User, Key, Globe, Save } from "lucide-react";

export default function SettingsPage() {
  const user = auth.getUserFromToken();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Username</Label>
            <Input value={user?.username || "admin"} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={user?.role || "admin"} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Backend URL</Label>
            <Input
              value={process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Configured via NEXT_PUBLIC_API_URL environment variable
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Scraping Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Default Max Results</Label>
              <Input defaultValue={50} type="number" min={1} max={500} />
            </div>
            <div className="space-y-2">
              <Label>Default Data Source</Label>
              <Input defaultValue="playwright" disabled />
            </div>
          </div>
          <Button
            onClick={() => toast.success("Settings saved (feature coming soon)")}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}