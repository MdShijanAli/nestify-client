import Link from "next/link";
import { Home, Mail, MapPin, Phone } from "lucide-react";

const propertyTypeLinks = [
  { label: "Apartments", type: "Apartment" },
  { label: "Houses", type: "House" },
  { label: "Commercial", type: "Commercial" },
  { label: "Land", type: "Land" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-lg">
                <Home className="text-primary-foreground h-5 w-5" />
              </div>
              <span className="font-heading text-lg font-bold">Nestify</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted partner in finding the perfect property. We connect
              buyers, sellers, and agents seamlessly.
            </p>
          </div>

          <div>
            <h4 className="font-heading mb-4 text-sm font-semibold">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href="/properties"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Properties
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading mb-4 text-sm font-semibold">
              Property Types
            </h4>
            <div className="flex flex-col gap-2">
              {propertyTypeLinks.map(({ label, type }) => (
                <Link
                  key={type}
                  href={`/properties?type=${encodeURIComponent(type)}`}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading mb-4 text-sm font-semibold">
              Contact Info
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>123 Real Estate Blvd, NY 10001</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>hello@nestify.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nestify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
