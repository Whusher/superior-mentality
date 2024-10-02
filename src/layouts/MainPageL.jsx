//Animations and dependencies
import AsideMenu from "./AsideMenuG";
import Typewriter from "typewriter-effect";
import Card from "./Card";

//Import image to main Screen
import FamilyImg from "../assets/family.avif";
import AgendaImg from "../assets/agenda.avif";
import GiftsImg from "../assets/Gifts.png";
import ConnectImg from "../assets/FamConnect.png";
import DailyImg from "../assets/Daily.png";

//Import a component
import Footer from "./Footer";

export default function MainPageL() {
  return (
    <div className="md:grid md:grid-cols-10 min-h-screen">
      {/* This is converted into a menu when display is small */}
      <AsideMenu/>
      <main className="col-span-8 bg-plus-min items-center flex flex-col">
        <div id="presentation" className="m-6 text-4xl font-sans text-white font-extrabold">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString("<span>Welcome to your adventure")
                  .pauseFor(3000)
                  .deleteAll()
                  .typeString("TDAH with the easiest way to perform your daily activities!")
                  .start();
              }}
            />
        </div>
        <div className="flex flex-col md:flex-row">
          <img
            src={FamilyImg}
            alt="Family Image"
            className="rounded-xl m-5 max-h-[300px]"
          />
          <div className="mx-4">
            <span className="block text-dark font-semibold font-sans text-6xl md:my-5">
              Enjoy your family
            </span>
            <span className="block text-white font-semibold font-sans text-3xl md:ml-10">
              without stress
            </span>
            <span className="block text-white font-semibold font-sans text-3xl md:ml-24">
              easy and free!
            </span>
          </div>
        </div>
        <div id="cards-container" className="flex flex-col md:grid md:grid-cols-3 xl:grid-cols-4 justify-center md:gap-5 my-3">
              <Card image={AgendaImg} description={"Custom your schedule to bring you to success "} title={"Agenda"}/>
              <Card image={GiftsImg} description={"Get amazing gift completing your daily objectives, with real motivation"} title={"Gifts & Badges"}/>
              <Card image={DailyImg} description={"Great activities for practice along the day to get up your brain with simple challenges!"} title={"Activities"}/>
              <Card image={ConnectImg} description={"All your family connected each other and his routines"} title={"Connect"}/>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
