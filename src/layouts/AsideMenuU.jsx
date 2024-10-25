import DropDownMenu from "./DropDownMenu"
import { News,HandClick,User,Brainly } from "../utils/SVGExporter"
import { Link, useNavigate } from "react-router-dom"
import { ResetEndpoint } from "../utils/EndpointExporter"
import { useAuth } from "../context/AuthContext"
export default function AsideMenuU({options = [ {icon: HandClick, menuOption: "Suscribe", pageRef:"/suscription" },{icon: User, menuOption: "Login" , pageRef:"/login" } , {icon: News, menuOption: "News", pageRef:"/news" }]}) {
  const {setIsAuthenticated} = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="col-span-2 bg-darker-light h-screen p-5 flex justify-between md:block overflow-y-auto sticky top-0"> 
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
          <button
            className="bg-red-500 text-white px-2 rounded-md hover:scale-105"
            onClick={async()=>{
              const res = await fetch(`${ResetEndpoint}/clearcookies`, {
                method: 'GET'
              })
              if(res.ok){
                setIsAuthenticated(false);
                navigate('/');
              }
            }}
          >LOGOUT</button>
        </ul>
        <div className="md:hidden">
          <DropDownMenu options={[ {icon: HandClick, menuOption: "Suscribe", pageRef:"/suscription" },{icon: User, menuOption: "Login" , pageRef:"/login" } , {icon: News, menuOption: "News", pageRef:"/news" }]} title={"Menu"}/>
        </div>
    </aside>
  )
}
