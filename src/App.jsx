import React from 'react';
import Navbar from './components/Navbar';
import HorizontalGallery from './components/HorizontalGallery';
import Services from './components/Services';
import Contact from './components/Contact';

function App() {
  return (
    <div className="App">
      <Navbar />
      
      {/* Removemos el Hero para que el cliente vea los proyectos directamente */}
      <div style={{ paddingTop: '100px' }}>
        <HorizontalGallery />
      </div>
      
      <Services />
      <Contact />
    </div>
  );
}

export default App;
