import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import SplashScreen from "./components/splash-screen";
import Routes from "./Routes";

export default function App() {
  return (
    <div className="min-h-screen overflow-y-auto font-sans antialiased">
      <React.Suspense fallback={<SplashScreen />}>
        <Toaster
          position="bottom-center"
          containerStyle={{
            bottom: 80,
          }}
        />

        <Routes />
      </React.Suspense>
    </div>
  );
}
