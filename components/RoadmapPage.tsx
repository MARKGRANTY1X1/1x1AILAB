import React from 'react';
import { BeakerIcon } from './Icons';

interface RoadmapItemProps {
  title: string;
  description: string;
  status: 'Done' | 'In Progress' | 'Planned';
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({ title, description, status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'Done':
        return 'border-green-500 bg-green-500/10';
      case 'In Progress':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'Planned':
        return 'border-blue-500 bg-blue-500/10';
    }
  };
  
  const getStatusPill = () => {
      switch (status) {
        case 'Done':
            return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500 text-white">Done</span>;
        case 'In Progress':
            return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-500 text-black">In Progress</span>;
        case 'Planned':
            return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500 text-white">Planned</span>;
      }
  }

  return (
    <div className={`p-5 rounded-lg border-l-4 ${getStatusClasses()}`}>
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            {getStatusPill()}
        </div>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{description}</p>
    </div>
  );
};


const RoadmapPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
            <BeakerIcon className="w-10 h-10 text-primary" />
            <div>
                <h1 className="text-3xl font-bold">Product Roadmap</h1>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">Our vision for the future of MineHub.</p>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-light-border dark:border-dark-border pb-2">Completed</h2>
            <div className="space-y-4">
                <RoadmapItem
                    title="Mining Engine Integration"
                    description="Frontend layer is complete. The UI now communicates with the native OS layer via a secure IPC bridge to control external, command-line miners."
                    status="Done"
                />
                 <RoadmapItem
                    title="Live Pool & Local Data"
                    description="The dashboard now receives and parses real-time log streams directly from the native miner process, providing accurate local hashrate and share data."
                    status="Done"
                />
                 <RoadmapItem
                    title="Secure Wallet Layer"
                    description="Implemented a non-custodial local wallet interface. The UI securely calls the native backend to generate keys and sign transactions, so users always control their funds."
                    status="Done"
                />
            </div>
             <h2 className="text-xl font-bold border-b border-light-border dark:border-dark-border pb-2 pt-4">In Progress</h2>
             <div className="space-y-4">
                <RoadmapItem
                    title="Payout & Conversion API"
                    description="Integrating with exchange APIs to provide real-time conversion rates and facilitate automatic payouts to user-selected tokens."
                    status="In Progress"
                />
                 <RoadmapItem
                    title="Advanced Overclocking Profiles"
                    description="Safely apply and manage hardware overclock settings directly from the dashboard for supported miners and hardware."
                    status="In Progress"
                />
            </div>
            <h2 className="text-xl font-bold border-b border-light-border dark:border-dark-border pb-2 pt-4">Planned</h2>
             <div className="space-y-4">
                 <RoadmapItem
                    title="Mobile Companion App"
                    description="Monitor your rigs, check your earnings, and receive alerts from anywhere with a native iOS and Android app."
                    status="Planned"
                />
                <RoadmapItem
                    title="Automated Profit Switching"
                    description="Configure the app to automatically switch between mining the most profitable coins based on real-time market data."
                    status="Planned"
                />
            </div>
        </div>
    </div>
  );
};

export default RoadmapPage;