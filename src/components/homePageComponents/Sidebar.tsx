const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white  flex flex-col  border-r border-white/60">
      <div className="p-4 font-bold text-lg">GDevelop</div>
      <nav className="flex-grow">
        <a href="#" className="block py-2.5 px-4 bg-secondary">
          Shop
        </a>
        <a href="#" className="block py-2.5 px-4 hover:bg-gray-700">
          Learn
        </a>
      </nav>
      <div className="p-4">
        <a href="#" className="block py-2.5 px-4 hover:bg-gray-700">
          Preferences
        </a>
        <a href="#" className="block py-2.5 px-4 hover:bg-gray-700">
          About GDevelop
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
