import { Facebook, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Footer Links */}
          <div className="flex space-x-8">
            <Link
              to="/company"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Company
            </Link>
            <Link
              to="/resources"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Resources
            </Link>
            <Link
              to="/legal"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Legal
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

      </div>
      <div className="copy">
        <p className="text-center text-sm text-gray-500 py-4">
          &copy; {new Date().getFullYear()} LMS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
