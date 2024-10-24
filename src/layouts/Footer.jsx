import { Facebook, Twitter, Instagram, Mail } from '../utils/SVGExporter'

export default function Footer({main=true}) {
  return (
    <footer className={`bg-[#1D2C40] text-[#BDD9F2] py-8 ${main?'col-span-full': 'col-span-8 col-start-3'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">ADHD Support Network</h2>
            <p className="text-[#8BADD9] mb-4">
              Empowering individuals with ADHD to thrive through education, support, and community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#BDD9F2] hover:text-[#6581A6]" aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-[#BDD9F2] hover:text-[#6581A6]" aria-label="Twitter">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-[#BDD9F2] hover:text-[#6581A6]" aria-label="Instagram">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-[#BDD9F2] hover:text-[#6581A6]" aria-label="Email">
                <Mail size={24} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#8BADD9] hover:text-[#BDD9F2]">ADHD Basics</a></li>
              <li><a href="#" className="text-[#8BADD9] hover:text-[#BDD9F2]">Treatment Options</a></li>
              <li><a href="#" className="text-[#8BADD9] hover:text-[#BDD9F2]">Coping Strategies</a></li>
              <li><a href="#" className="text-[#8BADD9] hover:text-[#BDD9F2]">Research & Studies</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#8BADD9] hover:text-[#BDD9F2]">Find a Therapist</a></li>
              <li><a href="#" className="text-[#8BADD9] hover:text-[#BDD9F2]">Support Groups</a></li>
              <li><a href="#" className="text-[#8BADD9] hover:text-[#BDD9F2]">Crisis Hotline</a></li>
              <li><a href="#" className="text-[#8BADD9] hover:text-[#BDD9F2]">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#3D5473] text-center text-[#6581A6]">
          <p>&copy; {new Date().getFullYear()} ADHD Support Network. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="text-[#8BADD9] hover:text-[#BDD9F2]">Privacy Policy</a>
            <a href="#" className="text-[#8BADD9] hover:text-[#BDD9F2]">Terms of Service</a>
            <a href="#" className="text-[#8BADD9] hover:text-[#BDD9F2]">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  )
}