"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  const info = [
    {
      icon: MapPin,
      title: "Address",
      text: "123 Real Estate Blvd, New York, NY 10001",
    },
    { icon: Phone, title: "Phone", text: "(555) 123-4567" },
    { icon: Mail, title: "Email", text: "info@estatehub.com" },
    { icon: Clock, title: "Business Hours", text: "Mon - Fri: 9AM - 6PM" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="font-heading text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 text-muted-foreground">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-semibold">
              Get in Touch
            </h2>
            <p className="mt-2 text-muted-foreground">
              Fill out the form and our team will respond within 24 hours.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {info.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border bg-card p-4 shadow-card"
                >
                  <item.icon className="h-5 w-5 text-secondary" />
                  <h3 className="mt-2 font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input placeholder="First Name" required />
                <Input placeholder="Last Name" required />
              </div>
              <Input type="email" placeholder="Email Address" required />
              <Input type="tel" placeholder="Phone Number" />
              <Textarea placeholder="Your message..." rows={5} required />
              <Button
                type="submit"
                className="w-full gradient-accent text-accent-foreground border-0"
                size="lg"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
