import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";


const Scanner = () => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Scanner mounted");

    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          navigate(`/scan/${decodedText}`);
        },
        (error) => {
          console.log("Scan error:", error);
        }
      )
      .catch((err) => {
        console.error("CAMERA ERROR:", err);
        alert("Camera not working: " + err);
      });

    return () => {
       if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop().catch(() => {});
       }
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Scanner</h2>

      {/* 🔥 YE SABSE IMPORTANT */}
      <div id="reader" style={{ width: "300px", margin: "auto" }}></div>
    </div>
  );
};

export default Scanner;