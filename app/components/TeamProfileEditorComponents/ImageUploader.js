import React, { useState, useEffect} from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ImageUploader = ({ allowMultiple, buttonMessage, images,setImages,prompt }) => {

  const [displayableImages, setDisplayableImages] = useState([]);

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files) return;

    try {
      const newImages = await Promise.all(
        Array.from(files).map(async (file) => {
            return {
              id: `${Date.now()}-${Math.round(Math.random() * 100)}-${file.name}`,
              file, // Store the actual file for later upload
              url: URL.createObjectURL(file), 
            };
        })
        
      );
  
      if (allowMultiple) {
        setImages((prevImages) => [...prevImages, ...newImages]);
        setDisplayableImages((prevDisplayable) => [
          ...prevDisplayable,
          ...newImages.map((img) => ({ id: img.id, url: img.url })),
        ]);
      } else {
        setImages(newImages.slice(0, 1)); // Replace the existing image for single upload
        setDisplayableImages(newImages.slice(0, 1).map((img) => ({ id: img.id, url: img.url })));

      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleRemoveImage = (id) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
    setDisplayableImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(displayableImages);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setDisplayableImages(reorderedImages);

    const reorderedImagesTwo = Array.from(images);
    const [movedImageTwo] = reorderedImagesTwo.splice(result.source.index, 1);
    reorderedImagesTwo.splice(result.destination.index, 0, movedImageTwo);
    setImages(reorderedImagesTwo);
    
  };

  return (
    <div className="pb-[8px]">
      {/* Hidden file input */}
      <div className="text-[15px] font-bold mb-[6px]">
        {prompt}
      </div>
      <label
        className="font-bold bg-white border border-streamlineBlue text-streamlineBlue border-[1.5] rounded-full text-[15px] " 
        style={{
          display: "inline-block",
          padding: "10px 20px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        {buttonMessage}
        <input
          type="file"
          accept="image/*"
          multiple={allowMultiple}
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </label>

      {/* Drag-and-Drop Container */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="image-list" direction="horizontal" 
         isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}
            >
              {images.map((image, index) => (
                <Draggable key={image.id} droppableId={"image-list"} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        position: "relative",
                        display: "inline-block",
                        ...provided.draggableProps.style,
                      }}
                    >
                      {/* Badge with Number */}

                      {allowMultiple && 
                        <div
                        style={{
                          position: "absolute",
                          top: "5px",
                          left: "5px",
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}
                      </div>}

                      {/* Image Preview */}
                      <img
                        src={image.url}
                        alt={`uploaded-${index}`}
                        style={{
                          width: "120px",
                          height: "auto",
                          objectFit: "contain",
                          borderRadius: "5px",
                        }}
                      />

                      {/* Remove Button */}
                      {allowMultiple &&
                      <button
                        onClick={() => handleRemoveImage(image.id)}
                        className="bg-streamlineBlue"
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                          fontSize: "14px",
                        }}
                      >
                        X
                      </button>}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ImageUploader;
