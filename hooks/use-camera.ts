import { useState } from 'react';

export function useCamera() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);

  const requestPermission = async () => {
    // Mock request permission
    setHasPermission(true);
    return true;
  };

  const captureReceipt = async () => {
    if (!hasPermission) {
      const allowed = await requestPermission();
      if (!allowed) return null;
    }
    const mockImage = 'content://media/external/images/media/mock-receipt.jpg';
    setScannedImage(mockImage);
    return mockImage;
  };

  const resetCamera = () => {
    setScannedImage(null);
  };

  return {
    hasPermission,
    scannedImage,
    requestPermission,
    captureReceipt,
    resetCamera,
  };
}
