import axios from "axios";
import { createCanvas, loadImage } from "canvas";

export const detectDiseases = async (req, res) => {

  console.log("Detecting diseases");
  // Get the base64 image from the request body
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Image is required" });
  }
  try {
    //Call the Roboflow API
    const response = await axios({
      method: "POST",
      url: "https://outline.roboflow.com/mangowise_i/1",
      params: {
        api_key: "PHTl0IU7cyIPQkfsPvcl",
      },
      data: image,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const imageData = response.data;
    let sootyMouldArea = 0;
    let anthracnoseArea = 0;
    let powderyMildewArea = 0;
    let affectedAreaPercentage;

    // Load the image using the canvas library
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const bufferImage = Buffer.from(base64Data, "base64");
    const canvasImage = await loadImage(bufferImage);
    const canvas = createCanvas(canvasImage.width, canvasImage.height);
    const ctx = canvas.getContext("2d");

    // Draw the original image on the canvas
    ctx.drawImage(canvasImage, 0, 0);

    // Mapping of class names to colors, sizes, and label background widths
    const classStyles = [
      {
        backgroundColor: "#00F9C9", //PowderyMildew
        labelColor: "black",
        fontSize: 40,
        fillStyle: "rgba(0, 249, 201, 0.5)",
        labelWidth: 250,
        labelHeight: 40,
        borderColor: "#00F9C9",
      },
      {
        backgroundColor: "#8622FF", //Anthracnose
        labelColor: "#000000",
        fontSize: 16,
        fillStyle: "rgba(134, 34, 255, 0.5)",
        labelWidth: 250,
        labelHeight: 20,
        borderColor: "#8622FF",
      },
      {
        backgroundColor: "#FE0056", //SootyMould
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

      let classStyle;
      if (className === "Powdery mildew") {
        classStyle = classStyles[0];
      } else if (className === "Anthracnose") {
        classStyle = classStyles[1];
      } else if (className === "Sooty mould") {
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
      ctx.lineWidth = 1;
      ctx.stroke();

      // Calculate the area of the drawn mask using the Shoelace formula
      const maskArea = calculatePolygonArea(points);

      if (className === "Powdery mildew") {
        powderyMildewArea += maskArea;
      } else if (className === "Anthracnose") {
        anthracnoseArea += maskArea;
      } else if (className === "Sooty mould") {
        sootyMouldArea += maskArea;
      }
    }
    const totalArea = powderyMildewArea + anthracnoseArea + sootyMouldArea;
    if (totalArea !== 0) {
      const powderyMildewPercentage = parseFloat(
        ((powderyMildewArea / totalArea) * 100).toFixed(2)
      );

      const anthracnosePercentage = parseFloat(
        ((anthracnoseArea / totalArea) * 100).toFixed(2)
      );

      const sootyMouldPercentage = parseFloat(
        ((sootyMouldArea / totalArea) * 100).toFixed(2)
      );

      affectedAreaPercentage = {
        powdery_mildew: powderyMildewPercentage,
        anthracnose: anthracnosePercentage,
        sooty_mould: sootyMouldPercentage,
      };
    }

    // Function to calculate the area of a polygon using the Shoelace formula
    function calculatePolygonArea(points) {
      let area = 0;
      const numPoints = points.length;

      for (let i = 0; i < numPoints; i++) {
        const current = points[i];
        const next = points[(i + 1) % numPoints];
        area += current.x * next.y - next.x * current.y;
      }

      return Math.abs(area / 2);
    }

    // Convert the canvas to a Buffer (PNG image data)
    const buffer = canvas.toBuffer();

    const base64Image = buffer.toString("base64");
    const classesSet = new Set();
    const diseaseData = [];

    const colorMapping = {
      "Sooty mould": "#FE0056",
      Anthracnose: "#8622FF",
      "Powdery mildew": "#00F9C9",
    };

    //get the classes
    imageData["predictions"].map((prediction) => {
      classesSet.add(prediction["class"]);
    });
    const classes = Array.from(classesSet);

    // Loop through each class and create a combined data object
    classes.forEach((className) => {
      const normalizedClassName = className
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const combinedObject = {
        class: normalizedClassName,
        affectedAreaPercentage:
          affectedAreaPercentage[className.toLowerCase().replace(" ", "_")] ||
          0,
        color: colorMapping[className] || "#000000",
      };
      diseaseData.push(combinedObject);
    });

    console.log(diseaseData);

    // Send the base64 image, classes and the full response from the API in the response
    res.json({
      image: base64Image,
      apiResponse: imageData,
      diseaseData: diseaseData,
    });
  } catch (error) {
    console.log("error ", error);
  }
};
