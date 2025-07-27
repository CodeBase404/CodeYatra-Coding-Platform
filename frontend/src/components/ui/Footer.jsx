import { Code, Github, Twitter, Linkedin, Youtube } from 'lucide-react';

function Footer(){
  return (
    <footer className="bg-white/5 border border-white/5 pt-8 pb-4 relative z-2">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Code className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold text-black dark:text-white">CodeYatra</span>
            </div>
            <p className="text-slate-400 mb-4">
              The ultimate platform to practice coding skills, prepare for interviews, and join a community of developers.
            </p>
            <div className="flex space-x-4">
              <SocialLink icon={<Github size={20} />} href="#" />
              <SocialLink icon={<Twitter size={20} />} href="#" />
              <SocialLink icon={<Linkedin size={20} />} href="#" />
              <SocialLink icon={<Youtube size={20} />} href="#" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Platform</h3>
            <FooterLinks 
              links={[
                { text: 'Problems', href: '#' },
                { text: 'Contest', href: '#' },
                { text: 'Articles', href: '#' },
                { text: 'Discuss', href: '#' },
                { text: 'Interview', href: '#' },
              ]}
            />
          </div>
        </div>

        <div className="border-t border-slate-700 pt-4 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <div>© 2025 CodeChallenger. All rights reserved.</div>
          <div className="mt-4 md:mt-0">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon, href }) => {
  return (
    <a 
      href={href}
      className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
    >
      {icon}
    </a>
  );
};

const FooterLinks = ({ links }) => {
  return (
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <a 
            href={link.href}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  );
};

const LanguageSelector = () => {
  return (
    <div className="relative">
      <select className="appearance-none bg-slate-700 border border-slate-600 text-slate-300 py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <option value="en">English</option>
        <option value="zh">中文</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="ja">日本語</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default Footer;
