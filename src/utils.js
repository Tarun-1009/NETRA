//The Save Helper (Ghost Link method)
export const saveImageToGallery = (canvas) => {
  const link = document.createElement('a');
  link.download = `NETRA-${Date.now()}.jpg`;
  link.href = canvas.toDataURL('image/jpeg', 0.8);
  link.click();
};
