import React from 'react';
import Footer from '../../screens/footer';
import { AppbarClient } from '../../components/AppbarClient';

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className=" h-full overflow-y-auto no-scrollbar">
        <div>
        <AppbarClient tracks={[]} />
        </div>
        <div className='pt-20'>
        {children}
        </div>
      
      <div>
        <Footer />
      </div>
    </main>
  );
};

export default MarketingLayout;