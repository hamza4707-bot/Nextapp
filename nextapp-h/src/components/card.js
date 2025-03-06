"use client";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, Image } from "@nextui-org/react";

export default function HeroCard() {
  const [imageUrl, setImageUrl] = useState(null);
  const [bgColor, setBgColor] = useState("rgba(0, 0, 0, 0.5)");

  useEffect(() => {
    // Fetch a random image from Unsplash
    fetch("https://source.unsplash.com/random/800x600")
      .then((response) => setImageUrl(response.url))
      .catch((error) => console.error("Image fetch error:", error));
  }, []);

  useEffect(() => {
    if (!imageUrl) return;

    const loadVibrant = async () => {
      if (window.Vibrant) {
        new window.Vibrant(imageUrl)
          .getPalette()
          .then((palette) => {
            if (palette.Vibrant) {
              setBgColor(`rgba(${palette.Vibrant.rgb.join(",")}, 0.7)`);
            }
          })
          .catch((error) => console.error("Color extraction error:", error));
      }
    };

    loadVibrant();
  }, [imageUrl]);

  if (!imageUrl) return <p>Loading...</p>;

  return (
    <div className="relative flex items-center justify-center h-screen">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 blur-3xl"
        style={{ backgroundColor: bgColor }}
      ></div>

      <Card className="relative z-10 max-w-2xl text-center p-6 bg-opacity-70 bg-white">
        <CardBody>
          <Image
            src={imageUrl}
            alt="Random Image"
            width={400}
            height={250}
            className="rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-bold mt-4">NextUI Hero Card</h1>
          <p className="text-gray-600 mt-2">
            A beautiful UI card with a random Unsplash image and blurred background.
          </p>
          <Button color="primary" className="mt-4">
            Get Started
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}