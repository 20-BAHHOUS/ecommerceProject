import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ShoppingBag, Shield, HelpCircle } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 pt-8 pb-6">
      <div className="container mx-auto px-4">
        {/* Top section with main links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Loopify</h4>
            <ul className="space-y-2">
              <li>
                <div className="text-sm text-gray-600 hover:text-gray-900">
                About us

                </div>
              </li>
              <li>
                <div className="text-sm text-gray-600 hover:text-gray-900">
                Sustainability
                </div>
              </li>
              <li>
                <div className="text-sm text-gray-600 hover:text-gray-900">
                Press
                </div>
              </li>
              <li>
                <div className="text-sm text-gray-600 hover:text-gray-900">
                Advertising
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Discover</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/category/electronics" className="text-sm text-gray-600 hover:text-gray-900">
                How it works
                </Link>
              </li>
              <li>
                <Link to="/category/vehicles" className="text-sm text-gray-600 hover:text-gray-900">
                Item Verification
                </Link>
              </li>
             
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Help & Support</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <HelpCircle size={14} className="mr-2 text-gray-500" />
                <Link to="/help" className="text-sm text-gray-600 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li className="flex items-center">
                <Shield size={14} className="mr-2 text-gray-500" />
                <Link to="/safety" className="text-sm text-gray-600 hover:text-gray-900">
                  Safety Tips
                </Link>
              </li>
              <li className="flex items-center">
                <ShoppingBag size={14} className="mr-2 text-gray-500" />
                <Link to="/buying" className="text-sm text-gray-600 hover:text-gray-900">
                  Buying Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Connect With Us</h4>
            <div className="flex space-x-3 mb-4">
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-gray-200 pt-5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Loopify. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-700">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-xs text-gray-500 hover:text-gray-700">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 