import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div className="flex flex-col justify-center items-center p-10 content-center min-h-screen">
        <h1 className="font-semibold text-2xl">Oops! This page is not available</h1>
        <span className="text-darker-light m-3">Return to your journey</span>
        <Link to={'/schedule'} className="p-4 bg-plus-min rounded-xl m-10 hover:-rotate-6">Go back</Link>
    </div>
  )
}
