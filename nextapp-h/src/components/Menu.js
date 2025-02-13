// src/components/Menu.js
import Link from 'next/link';

const Menu = () => {
  return (
    <nav className="bg-white p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-black text-2xl font-bold">
          <Link href="/">
            {/* No <a> tag needed */}
            Tripper
          </Link>
        </div>
        <div>
          <ul className="flex space-x-5">
            <li>
              <Link href="/" >
                {/* No <a> tag needed */}
                <span className="text-black hover:bg-blue-700 hovertext px-3 py-2 rounded-md ">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/about">
                {/* No <a> tag needed */}
                <span className="text-black hover:bg-blue-700 hovertext px-3 py-2 rounded-md ">About</span>
              </Link>
            </li>
            <li>
              <Link href="/blog">
                {/* No <a> tag needed */}
                <span className="text-black hover:bg-blue-700 hovertext px-3 py-2 rounded-md ">blog</span>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                {/* No <a> tag needed */}
                <span className="text-black hover:bg-blue-700 hovertext px-3 py-2 rounded-md ">contact</span>
              </Link>
            </li>
           
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
