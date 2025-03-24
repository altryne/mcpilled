import { STORAGE_URL } from "../constants/urls";

export const IMAGE_SIZES = [300, 500, 1000];

export const getImageUrl = (image, size = null) => {
  const { src } = image;
  // Just return the direct image URL
  return src;
};

export const getEntryImageProps = (image) => {
  const imageUrl = getImageUrl(image);
  return { src: imageUrl };
};

export const getLightboxImageProps = (image) => {
  const imageUrl = getImageUrl(image);
  return { src: imageUrl };
};
