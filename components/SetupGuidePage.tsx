import React from 'react';
import { QuestionMarkCircleIcon, ArrowTopRightOnSquareIcon } from './Icons';

const GuideStep: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
  <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg">
    <div className="flex items-center mb-4">
      <span className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-content font-bold text-lg mr-4">{number}</span>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="space-y-3 text-light-text-secondary dark:text-dark-text-secondary pl-14">
      {children}
    </div>
  </div>
);

const SetupGuidePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <QuestionMarkCircleIcon className="w-10 h-10 text-primary" />
        <h1 className="text-3xl font-bold">How to Start Mining for Real Rewards</h1>
      </div>
      
      <div className="p-4 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-md border border-blue-300 dark:border-blue-700">
        <strong>Important Note:</strong> This is a **desktop application**, not a website. It is designed to be a secure, user-friendly interface that controls powerful command-line mining software on your computer. This direct control is what allows for real mining, something a regular website cannot do.
      </div>


      <GuideStep number={1} title="Download a Miner Program">
        <p>This dashboard controls a separate, real mining program. You need to download one first. These are command-line tools that this app will manage for you.</p>
        <p>Popular choices include:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <a href="https://github.com/trexminer/T-Rex/releases" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold inline-flex items-center">
              T-Rex Miner
              <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1.5" />
            </a>: Excellent for NVIDIA GPUs.
          </li>
          <li>
            <a href="https://github.com/xmrig/xmrig/releases" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold inline-flex items-center">
              XMRig
              <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1.5" />
            </a>: A great choice for CPU mining Monero (XMR) and other coins.
          </li>
          <li>
            <a href="https://github.com/todxx/teamredminer/releases" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold inline-flex items-center">
              TeamRedMiner
              <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1.5" />
            </a>: A top-tier option for AMD GPUs.
          </li>
        </ul>
        <p className="mt-2 p-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-md border border-yellow-300 dark:border-yellow-700 text-sm">
          <strong>Security:</strong> Always download miners from their official GitHub pages. Your antivirus might flag them as threats; this is often a false positive because of their nature, but always be cautious.
        </p>
      </GuideStep>

      <GuideStep number={2} title="Choose a Mining Pool">
        <p>Mining solo is very difficult. A "pool" allows you to combine your computer's power with other miners to earn rewards more consistently. You get paid for the "shares" of work you contribute.</p>
        <p>You need to find the pool's server address, called a "Stratum URL". Examples:</p>
        <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-light-text dark:text-dark-text">2Miners:</strong> Popular and supports a wide variety of coins.</li>
            <li><strong className="text-light-text dark:text-dark-text">Ethermine/Flypool:</strong> One of the largest and most trusted pool networks.</li>
        </ul>
        <p>On the pool's website, find the "Getting Started" page for your chosen coin. It will list Stratum URLs for different regions (e.g., US-East, Europe, Asia).</p>
        <p>An example Stratum URL looks like this: <code className="bg-gray-200 dark:bg-gray-900 px-1 py-0.5 rounded text-sm">stratum+tcp://etc.2miners.com:1010</code></p>
      </GuideStep>
      
      <GuideStep number={3} title="Configure This Application">
        <p>Now, connect this dashboard to the miner and pool you've chosen. Go to the <strong className="text-light-text dark:text-dark-text">Settings</strong> page.</p>
        <div className="space-y-3">
            <p><strong>1. Pool URL:</strong> In the "Pool & Miner Configuration" section, paste the Stratum URL you found in Step 2 into the "Pool URL" field.</p>
            <p><strong>2. Worker Name:</strong> Give your computer a unique name (e.g., "MyGamingPC"). This helps you identify it on the pool's dashboard.</p>
            <p><strong>3. Miner Executable:</strong> In the "Manage Miners" section, click "Add New Miner".
                <ul className="list-decimal pl-6 mt-1">
                    <li>Give it a name, like "T-Rex Miner".</li>
                    <li>For the path, provide the full file path to the <code className="bg-gray-200 dark:bg-gray-900 px-1 py-0.5 rounded text-sm">.exe</code> file you downloaded in Step 1. Example: <code className="bg-gray-200 dark:bg-gray-900 px-1 py-0.5 rounded text-sm">C:\Miners\t-rex\t-rex.exe</code></li>
                </ul>
            </p>
            <p><strong>4. Wallet Address:</strong> On the main <strong className="text-light-text dark:text-dark-text">Dashboard</strong>, select the coin you want your rewards paid out in, and paste your personal wallet address for that coin. This is where the pool will send your earnings!</p>
        </div>
      </GuideStep>

      <GuideStep number={4} title="Start Mining!">
          <p>Return to the <strong className="text-light-text dark:text-dark-text">Dashboard</strong>.</p>
          <p>Double-check that your selected coin, wallet address, and miner are all correct. When you're ready, click the <strong className="text-primary">"Start Mining"</strong> button.</p>
          <p>The app will launch the miner program in the background with all the correct settings. You will see the miner's actual, real-time output appear in the "Miner Logs" console, and your hashrate will update in the chart.</p>
      </GuideStep>

    </div>
  );
};

export default SetupGuidePage;