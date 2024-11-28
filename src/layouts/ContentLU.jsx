import Footer from "./Footer";
import AsideMenuG from "./AsideMenuG";

export default function ContentLA({child}) {
  return (
    <div className="md:grid md:grid-cols-10 min-h-screen">
    {/* This is converted into a menu when display is small */}
    <AsideMenuG/>
    <main className="col-span-8 bg-plus-min items-center flex flex-col p-5">
        {child}
    </main>
    <Footer main={true}/>
  </div>
  )
}
