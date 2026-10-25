import { Carousel } from "react-bootstrap";

interface ImageCarouselProps {
    imageUrls: string[];
    variant?: "dark" | string;
}

export const ImageCarousel = (props: ImageCarouselProps) => {

    const { imageUrls, variant } = props;

    return (<Carousel controls indicators variant={variant}>
        {imageUrls.map(imageUrl => (
        <Carousel.Item key={imageUrl}>
            <img 
                src={imageUrl} 
                //onClick={() => window.location.href = imageUrl}
                width="100%" 
                className="clickable"
            />
        </Carousel.Item>))}
    </Carousel>);

}