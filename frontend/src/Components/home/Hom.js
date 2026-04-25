import FoodBanner1 from "./Banner";
import GalleryAutoSlideZoom from "./Gal";
import GalleryWithState from "./Galle";
import Carousel2 from "./Slider2";
import CategorySlider from "./CategorySlider";
import Pricing from "./Pricing";
import WhyChooseUs from "./WhyChoose";
import TakeItForward from "./TakeItFormward";
import Testimonials from "./Testimon";
import Work from "./Work";

const Hom = () => {
  return (
    <div className="bg-white min-h-screen">
      <Carousel2/>
      <CategorySlider />
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Top rated chefs near you</h2>
        <GalleryWithState/>
      </div>

      <Work/>
      <Testimonials/>
      <Pricing/>
      <WhyChooseUs/>
      <GalleryAutoSlideZoom/>
      <TakeItForward/>
      <FoodBanner1/>
    </div>
  )
}

export default Hom
