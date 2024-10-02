import { useState } from "react";
import { Menu } from "../utils/SVGExporter";
import { Link } from "react-router-dom";

export default function DropDownMenu({options}) {
  const [isOpen, setIsOpen] = useState(false); // Estado para abrir/cerrar el menú

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Cambia el estado para abrir/cerrar
  };

  return (
    <div className="relative inline-block text-left">
      {/* Botón del Dropdown */}
      <button
        onClick={toggleDropdown}
        className="bg-dark text-white px-4 py-2 rounded-md focus:outline-none"
      >
        {Menu()}
      </button>

      {/* Opciones del menú */}
      {isOpen && (
        <ul className="absolute right-5 mt-2 w-56 bg-white border rounded-md shadow-lg">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-minimal"
            >
              <Link to={option.pageRef} className="flex">
                    <span className="mx-2">{option.menuOption}</span>{option.icon()}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
