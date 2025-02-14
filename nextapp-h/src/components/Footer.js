// src/components/Footer.js
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#333] text-white p-4" style={{ height: '300px', width: '100%' }}>
      <div className="container mx-auto h-full flex justify-between items-center">
        {/* First Column: Tripper Title */}
        <div className="text-2xl font-bold">
          <Link href="/">
            <span className="text-white hover:text-blue-500 cursor-pointer">Tripper</span>
          </Link>
        </div>

        {/* Second Column: Links */}
        <div>
          <ul className="flex space-x-8">
            <li>
              <Link href="/">
                <span className="text-white hover:text-blue-500 cursor-pointer">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <span className="text-white hover:text-blue-500 cursor-pointer">About</span>
              </Link>
            </li>
            <li>
              <Link href="/blog">
                <span className="text-white hover:text-blue-500 cursor-pointer">Blog</span>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <span className="text-white hover:text-blue-500 cursor-pointer">Contact</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;