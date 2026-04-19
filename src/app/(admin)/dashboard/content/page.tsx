"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Image, FileText } from "lucide-react";
import { toast } from "sonner";

export default function DashboardContentPage() {
  const [heroTitle, setHeroTitle] = useState("Find Your Dream Property");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Discover thousands of properties across the United States.",
  );
  const [aboutText, setAboutText] = useState(
    "EstateHub is your trusted partner in real estate. We connect buyers, sellers, and agents seamlessly with cutting-edge technology and personalized service.",
  );
  const [contactEmail, setContactEmail] = useState("info@estatehub.com");
  const [contactPhone, setContactPhone] = useState("(555) 123-4567");
  const [contactAddress, setContactAddress] = useState(
    "123 Real Estate Blvd, New York, NY 10001",
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Content Management</h1>
        <p className="text-muted-foreground">
          Manage website content and pages
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Image className="h-5 w-5 text-secondary" />
              Hero Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Textarea
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                rows={3}
              />
            </div>
            <Button
              onClick={() => toast.success("Hero content saved!")}
              className="gradient-accent border-0 text-accent-foreground"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <FileText className="h-5 w-5 text-secondary" />
              About Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>About Text</Label>
              <Textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                rows={5}
              />
            </div>
            <Button
              onClick={() => toast.success("About content saved!")}
              className="gradient-accent border-0 text-accent-foreground"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Email</Label>
                <Input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={() => toast.success("Contact info saved!")}
              className="mt-4 gradient-accent border-0 text-accent-foreground"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
