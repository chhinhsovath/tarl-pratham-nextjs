'use client';

import React, { useRef, useState, useCallback } from 'react';
import { CameraOutlined, CloseOutlined, CheckOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Modal, message } from 'antd';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  buttonText?: string;
  buttonTextKh?: string;
  aspectRatio?: number;
  quality?: number;
}

export default function CameraCapture({
  onCapture,
  buttonText = 'Take Photo',
  buttonTextKh = 'ថតរូប',
  aspectRatio = 4 / 3,
  quality = 0.8,
}: CameraCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      message.error('មិនអាចបើកកាមេរ៉ាបាន។ សូមពិនិត្យការអនុញ្ញាត។');
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    setImageData(dataUrl);
    
    // Stop camera after capture
    stopCamera();
  }, [quality, stopCamera]);

  const retakePhoto = useCallback(() => {
    setImageData(null);
    startCamera();
  }, [startCamera]);

  const confirmPhoto = useCallback(() => {
    if (imageData) {
      onCapture(imageData);
      handleClose();
      message.success('រូបភាពបានរក្សាទុក');
    }
  }, [imageData, onCapture]);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    if (isCameraActive) {
      stopCamera();
      setTimeout(() => startCamera(), 100);
    }
  }, [isCameraActive, startCamera, stopCamera]);

  const handleOpen = () => {
    setIsOpen(true);
    // Check if camera API is available
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      startCamera();
    } else {
      // Fallback to file input for devices without camera API
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            setImageData(dataUrl);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  const handleClose = () => {
    stopCamera();
    setIsOpen(false);
    setImageData(null);
  };

  return (
    <>
      <Button
        type="default"
        icon={<CameraOutlined />}
        onClick={handleOpen}
        className="flex items-center gap-2"
      >
        <span className="hidden sm:inline">{buttonText}</span>
        <span className="sm:hidden">{buttonTextKh}</span>
      </Button>

      <Modal
        open={isOpen}
        onCancel={handleClose}
        footer={null}
        width="100%"
        style={{ maxWidth: '600px', top: 20 }}
        closeIcon={<CloseOutlined />}
        title={imageData ? 'ពិនិត្យរូបភាព' : 'ថតរូបភាព'}
      >
        <div className="relative">
          {/* Camera view or captured image */}
          {imageData ? (
            <div className="relative">
              <img 
                src={imageData} 
                alt="Captured" 
                className="w-full rounded-lg"
                style={{ aspectRatio: `${aspectRatio}` }}
              />
            </div>
          ) : (
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full"
                style={{ aspectRatio: `${aspectRatio}` }}
              />
              
              {/* Camera overlay guides */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-white/30 rounded-lg" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 border-2 border-white rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Hidden canvas for image capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Camera controls */}
          <div className="flex justify-center gap-4 mt-4">
            {imageData ? (
              <>
                <Button
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={retakePhoto}
                  className="flex-1"
                >
                  ថតម្តងទៀត
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<CheckOutlined />}
                  onClick={confirmPhoto}
                  className="flex-1"
                >
                  ប្រើរូបនេះ
                </Button>
              </>
            ) : (
              <>
                {isCameraActive && (
                  <>
                    <Button
                      size="large"
                      onClick={switchCamera}
                      className="px-4"
                    >
                      🔄
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      icon={<CameraOutlined />}
                      onClick={capturePhoto}
                      className="px-8"
                    >
                      ថត
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}