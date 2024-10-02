export default function Card({image, description, title}) {
  return (
    <div className="max-w-[300px] h-[400px] p-4 mx-4 rounded-xl hover:shadow-xl bg-minimal flex justify-center flex-col items-center my-4
      transition-all duration-500 ease-linear hover:scale-110 hover:shadow-opac
    ">
          <img src={image} alt={title} className="w-full h-[250px] object-cover rounded-xl"/>
        <p className="text-dark font-semibold my-2 text-xl">{title}</p>
        <p className="text-darker-light font-sans text-left text-lg font-medium">{description}</p>
    </div>
  )
}
