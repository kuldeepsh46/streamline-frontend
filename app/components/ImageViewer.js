import MoveLeft from "../../public/MoveLeft.svg"
import MoveRight from "../../public/MoveRight.svg"

export default function ImageViewer({images,currentIndex,closeModal,setCurrentIndex}){

    const showNextImage = () => {
        setCurrentIndex((currentIndex + 1) % images.length);
      };
    
      const showPreviousImage = () => {
          setCurrentIndex((currentIndex - 1 + images.length) % images.length);
      };
    

    return(

        <div className="fixed inset-0 bg-black flex w-screen
        items-center justify-center z-50 ">
              


              <div className="relative w-screen
               h-full flex items-center justify-center overflow-hidden">
              
              <button
                onClick={closeModal}
                className="absolute top-4 left-4 
                text-white text-2xl 
                cursor-pointer ß"
              >
                <div className="flex items-center space-x-[20px]">
                    <MoveLeft/>
                    <div className="text-[17px]">
                    Go back to team page  
                    </div>
                </div>
              </button>
    
                <button onClick={showPreviousImage}>
                <div
                className=" absolute left-[10px] bottom-1/2
                transform translate-y-1/2 
                 bg-gray-700 bg-opacity-50 hover:bg-opacity-75 text-white p-2 
                 rounded-full focus:outline-none"
                >
                    <MoveLeft/>
                </div>
                </button>
    
                <div className="w-full">
                    <img
                      src={images[currentIndex]}
                      className="w-full h-full object-cover"
                      alt={`Image ${currentIndex + 1}`}
                      style={{
                      }}/>

                </div>
    
                <button onClick={showNextImage}>
                <div
                className=" absolute right-[10px] bottom-1/2
                transform translate-y-1/2 
                 bg-gray-700 bg-opacity-50 hover:bg-opacity-75 text-white 
                 p-2 
                 rounded-full focus:outline-none"
                >
                    <MoveRight/>
                </div>
                </button>
              </div>

              <div
                className="absolute left-1/2 bottom-[20%] transform -translate-x-1/2 
                 bg-gray-700 bg-opacity-50  text-white px-2 py-[3px] 
                 rounded-full focus:outline-none text-[20px] font-bold"
                >
                    {currentIndex+1} / {images.length}
                </div>
            </div>
    )
}