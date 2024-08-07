const getImageSrc = (imageUrl) => {
  // Check if the image URL contains 'http' or 'https' indicating an external link
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl; // Return the external URL directly
  } else {
    return `${apiUrl}/images/${imageUrl}`; // Return local URL
  }
};

exports = { getImageSrc };
