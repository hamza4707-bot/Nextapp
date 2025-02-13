// src/pages/contact.js
import Menu from '../components/Menu'; // Import the Menu component

const Contact = () => {
  return (
    <div>
      {/* Include the Menu Component */}
      <Menu />

      <div className="container mx-auto mt-5 px-4">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        
        {/* Contact Form or Info */}
        <div className="bg-white p-6 mx-auto rounded-lg shadow-lg w-75">
          <h3 className="text-2xl font-semibold mb-4 text-black">Get in Touch</h3>
          <p className="text-gray-700 mb-4">
            If you have any questions, feel free to reach out to us!
          </p>

          {/* Example Form (you can replace it with a real form later) */}
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input type="email" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Message</label>
              <textarea className="w-full p-2 border border-gray-300 rounded-md" rows="4"></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
