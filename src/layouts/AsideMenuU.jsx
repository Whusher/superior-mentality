import DropDownMenu from "./DropDownMenu";
import { News, HandClick, User, Brainly,XIcon } from "../utils/SVGExporter";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuOps = [
  { icon: HandClick, menuOption: "Games", pageRef: "/games" },
  { icon: News, menuOption: "Schedule", pageRef: "/schedule" },
  { icon: User, menuOption: "Profile", pageRef: "/profile" },
];

export default function AsideMenuU({ options = menuOps }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="col-span-2 bg-darker-light h-screen p-5 flex justify-between md:block overflow-y-auto sticky top-0">
      <h3 className="text-minimal text-center text-2xl md:my-5">
        Superior Mentality {Brainly()}
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
        <button
          className="cursor-pointer mx-auto p-3 text-red-600 font-semibold font-sans text-lg w-full rounded-xl hover:bg-plus-min flex justify-center items-center"
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
        >
          <span className="mx-2">Logout</span>
          {XIcon()}
        </button>
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
