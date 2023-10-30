import axios from "axios";
import { createCanvas, loadImage } from "canvas";

export const detectVariety = async (req, res) => {
  // Get the base64 image from the request body
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Image is required" });
  }
  try {
    //Call the Roboflow API
    const response = await axios({
      method: "POST",
      url: "https://outline.roboflow.com/mangowise-ecg8e/3",
      params: {
        api_key: "rj601qLuIiiLAQ8eMKck",
      },
      data: image,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const imageData = response.data;
    console.log(imageData);

    // Load the image using the canvas library
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const bufferImage = Buffer.from(base64Data, "base64");
    const canvasImage = await loadImage(bufferImage);
    console.log("canvasImage", canvasImage);
    const canvas = createCanvas(canvasImage.width, canvasImage.height);
    const ctx = canvas.getContext("2d");

    // Draw the original image on the canvas
    ctx.drawImage(canvasImage, 0, 0);

    // Mapping of class names to colors, sizes, and label background widths
    const classStyles = [
      {
        backgroundColor: "#00F9C9", //Petti aba
        labelColor: "black",
        fontSize: 40,
        fillStyle: "rgba(0, 249, 201, 0.5)",
        labelWidth: 250,
        labelHeight: 40,
        borderColor: "#00F9C9",
      },
      {
        backgroundColor: "#8622FF", //Karthakolomban
        labelColor: "#000000",
        fontSize: 16,
        fillStyle: "rgba(134, 34, 255, 0.5)",
        labelWidth: 250,
        labelHeight: 20,
        borderColor: "#8622FF",
      },
      {
        backgroundColor: "#FE0056", //TJC
        labelColor: "black",
        fontSize: 45,
        fillStyle: "rgba(254, 0, 86, 0.5)",
        labelWidth: 420,
        labelHeight: 50,
        borderColor: "#FE0056",
      },
      {
        backgroundColor: "gray", // Default background color if class not found
        labelColor: "white", // Default label color if class not found
        fontSize: 14, // Default font size if class not found
        fillStyle: "rgba(255, 0, 0, 0.3)", // Default fill style color if class not found
        labelWidth: 100, // Default label background width if class not found
        borderColor: "black", // Default border color if class not found
      }, //
    ];

    // Draw instance segmentation on the canvas based on the received response data
    for (const prediction of imageData["predictions"]) {
      const { class: className, points, confidence } = prediction;

      // Calculate the center point of the identified object
      const centerX =
        points.reduce((sum, point) => sum + point.x, 0) / points.length;
      const centerY =
        points.reduce((sum, point) => sum + point.y, 0) / points.length;
      // Get the style for the current class

      let classStyle;
      if (className === "Petti Aba") {
        classStyle = classStyles[0];
      } else if (className === "Karthakolomban") {
        classStyle = classStyles[1];
      } else if (className === "TJC") {
        classStyle = classStyles[2];
      } else {
        classStyle = classStyles[3];
      }

      // Draw the mask as a closed polygon with the class-specific fill style color
      ctx.fillStyle = classStyle.fillStyle;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fill();

      // Add border around the instance segmented object with the class-specific border color
      ctx.strokeStyle = classStyle.borderColor;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Convert the canvas to a Buffer (PNG image data)
    const buffer = canvas.toBuffer();

    // Convert the buffer to a base64 string
    const base64Image = buffer.toString("base64");

    // Loop through each class and create a combined data object

    // You can send this combinedData in the response:
    res.json({
      image: base64Image,
      variety: response.data.predictions[0]?.class,
      captured: image,
    });

    console.log("response ", response.data.predictions[0]?.class);
  } catch (error) {
    console.log("error ", error);
  }
};
