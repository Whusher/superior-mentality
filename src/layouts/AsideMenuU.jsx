import DropDownMenu from "./DropDownMenu";
import { News, User, Brainly,XIcon,History, Games, Records, Suscription } from "../utils/SVGExporter";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuOps = [
  { icon: Games, menuOption: "Games", pageRef: "/activities" },
  { icon: News, menuOption: "Schedule", pageRef: "/schedule" },
  { icon: User, menuOption: "Profile", pageRef: "/profile" },
  { icon: Records, menuOption: "Records", pageRef: "/records" },
  { icon: History, menuOption: "History", pageRef: "/History" },
  { icon: Suscription, menuOption: "Suscription", pageRef: "/subscription" },
];

export default function AsideMenuU({ options = menuOps }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="col-span-2 bg-darker-light md:h-screen p-5 flex justify-between md:block md:overflow-y-auto md:sticky top-0">
      <h3 className="text-minimal text-center text-2xl md:my-5">
        Superior Mentality {Brainly()}
        <p className="text-lg mt-5"> Welcome {user.name}</p>
      </h3>
      <ul className="hidden md:block">
        {options.map((option, index) => {
          return (
            <Link
              key={index}
              to={option.pageRef}
              className="cursor-pointer m-3 p-3 text-white font-semibold font-sans text-lg rounded-xl hover:bg-plus-min flex justify-center items-center"
            >
              <span className="mx-2">{option.menuOption}</span>
              {option.icon()}
            </Link>
          );
        })}
        <li
          className="cursor-pointer mx-auto p-3 text-red-600 font-semibold font-sans text-lg w-full rounded-xl hover:bg-plus-min flex justify-center items-center"
          onClick={async () => {
            await logout();
            navigate("/");
          }}
        >
          <span className="mx-2 text-white">Logout</span>
          {XIcon()}
        </li>
      </ul>
      <div className="md:hidden">
        <DropDownMenu
          options={menuOps}
          title={"Menu"}
        />
      </div>
    </aside>
  );
}
