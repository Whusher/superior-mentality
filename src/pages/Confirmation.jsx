import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react"
import { CheckIcon } from "../utils/SVGExporter";
import { toast } from "react-toastify";
import { AuthEndpoint } from "../utils/EndpointExporter";
export default function Confirmation() {
  const [validate,setValidate] = useState(false)
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get('idMaster');
  const navigate = useNavigate()
  useEffect(()=>{
    const fetchStateConfirmation = async() =>{
      try{
          const res = await fetch(`${AuthEndpoint}/set-up-account`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
              accountToValidate: paramValue
            })
          })
          if(res.ok){
            toast.success('Account Verified')
            setValidate(true)
          }else{
            toast.error('An error has ocurred please try again later...')
          }
      }
      catch(e){
        toast.error('Your email hasnt be verified try again...')
      }
    }
    fetchStateConfirmation()
  },[]) 
  return (
    <div className="h-[100vh] w-[100vw] bg-minimal flex flex-col justify-center items-center">
        {validate ? (
        <div className="text-center text-dark w-3/4 md:w-auto flex flex-col justify-center">
            <p className="text-2xl text-center flex justify-center items-center">Yor email has been validated successfully <span>{CheckIcon()}</span> </p> 
            <p className="text-2xl">Confirmation</p> 
            <Link to={'/login'} className="bg-dark text-white font-bold p-3 rounded-lg m-4 hover:-rotate-6 hover:shadow-lg hover:shadow-green-600 m-4">
                Get into
            </Link>
        </div>
        ):(
        <div>
            <p className="font-bold">Validating your email, please wait...</p>
        </div>
        ) }
    </div>
  )
}
