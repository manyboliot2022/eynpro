
import React, { useState } from 'react';
import Layout from './components/Layout';
import CostCalculator from './views/CostCalculator';
import ProductManager from './views/ProductManager';
import POS from './views/POS';
import Finance from './views/Finance';
import { AppMode } from './types';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.CALCULATOR);

  const renderContent = () => {
    switch (activeMode) {
      case AppMode.CALCULATOR: return <CostCalculator />;
      case AppMode.MANAGER: return <ProductManager />;
      case AppMode.POS: return <POS />;
      case AppMode.FINANCE: return <Finance />;
      default: return <CostCalculator />;
    }
  };

  const getTitle = () => {
    switch (activeMode) {
      case AppMode.CALCULATOR: return "Calcul Coûts";
      case AppMode.MANAGER: return "Stock & CRM";
      case AppMode.POS: return "Ventes & Devis";
      case AppMode.FINANCE: return "Compta & CA";
    }
  };

  return (
    <Layout activeMode={activeMode} onModeChange={setActiveMode} title={getTitle()}>
      {renderContent()}
    </Layout>
  );
};

export default App;
