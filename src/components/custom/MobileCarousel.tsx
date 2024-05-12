// "use client";

import Link from "next/link";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

type Props = {};

const MobileCarousel = (props: Props) => {
  
  return (
    <div className="flex items-center justify-center">
      <div className="w-3/5 h-4/5 m-0">
        <Carousel className="mb-32">
          <CarouselContent>
            <CarouselItem className="mt-32">
              <h3 className="text-white text-3xl font-bold leading-10 mb-3">
                e-Visa to 50+ Countries
              </h3>
              <p className="text-md text-white font-medium">
                e-Visa enabled for 190 Nationalities{" "}
              </p>
            </CarouselItem>
            <CarouselItem className="mt-32">
              <h3 className="text-white text-3xl font-bold leading-10 mb-3">
                We use AI, Robotics & Smart Technology{" "}
              </h3>
              <p className="text-md text-white font-medium">
                We save up to 90% time by Automating Visa forms, Processes &
                Data.{" "}
              </p>
            </CarouselItem>
            <CarouselItem className="mt-32">
              <h3 className="text-white text-3xl font-bold leading-10 mb-3">
                You Control Your Data{" "}
              </h3>
              <p className="text-md text-white font-medium">
                We adhere to GDPR principles and ISO 27001 standards for
                Information Security.{" "}
              </p>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <Link href={"new-visa"}>
          <Button variant={"white"} size={"full"} rounded={"full"}>
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default MobileCarousel;
