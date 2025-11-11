'use client';

import EmployerSideBar from '@/components/sidebar/EmployerSideBar';
import Header from '@/components/ui/header';
import EmployerTab from '@/components/employer/EmployerTab';
import React from 'react';

export default function LayoutEmployerView({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-white shadow-sm">
        <Header />
      </header>

      {/* Main layout with padding for fixed header */}
      
      <main className="flex pt-16"> 
        {/* Sticky Sidebar */}
        <div className="sticky top-16 h-[calc(100vh-4rem)]">
          <EmployerSideBar />
        </div>

        {/* Contenedor principal para EmployerTab y children.
          Debe ocupar el espacio restante (flex-1).
          Debe manejar el scroll vertical de su contenido.
        */}
        <div className="flex flex-1 flex-col md:flex-row overflow-y-auto h-[calc(100vh-4rem)]">
          
          {/* Contenedor de EmployerTab: Le damos un ancho FIJO en pantallas grandes, no solo un MAX-width. */}
          <div className="w-full md:w-80 lg:w-96 py-12 flex-shrink-0"> {/* Ejemplo: usa un ancho fijo como w-80 o w-96 para md+ */}
            <EmployerTab />
          </div>
          
          {/* Scrollable content: Ocupa el espacio restante (flex-1) */}
          <div className="flex-1 py-10 px-6"> 
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}