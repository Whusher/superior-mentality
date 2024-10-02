import { Link } from "react-router-dom";
import { Brainly,HandClick,User,News} from "../utils/SVGExporter"
import DropDownMenu from "./DropDownMenu";


export default function AsideMenuG({options = [ {icon: HandClick, menuOption: "Suscribe", pageRef:"/suscription" },{icon: User, menuOption: "Login" , pageRef:"/login" } , {icon: News, menuOption: "News", pageRef:"/news" }]}) {
  return (
    <aside className="col-span-2 bg-darker-light md:min-h-screen p-5 flex justify-between md:block"> 
        <h3 className="text-minimal text-center text-2xl md:my-5">Superior Mentality {Brainly()}</h3>
        <ul className="hidden md:block">
          {
            options.map((option, index)=>{
              return (
                <li key={index} 
                  className="cursor-pointer m-3 p-3 text-white font-semibold font-sans text-lg rounded-xl hover:bg-plus-min flex justify-center items-center">
                  <Link to={option.pageRef} className="flex">
                    <span className="mx-2">{option.menuOption}</span>{option.icon()}
                  </Link>
                </li>
              )
            })
          }
        </ul>
        <div className="md:hidden">
          <DropDownMenu options={options} title={"Menu"}/>
        </div>
    </aside>
  )
}
