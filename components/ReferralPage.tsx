import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { UsersIcon, ClipboardIcon, TwitterIcon, TelegramIcon, ShareIcon } from './Icons';
import { useToast } from '../contexts/ToastContext';

const SocialShareButton: React.FC<{
  network: 'twitter' | 'telegram' | 'generic';
  text: string;
  url: string;
}> = ({ network, text, url }) => {
  const { addToast } = useToast();
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  let shareUrl = '';
  let Icon: React.FC<any>;
  let label = '';
  let colorClasses = '';

  switch (network) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
      Icon = TwitterIcon;
      label = 'Twitter';
      colorClasses = 'bg-[#1DA1F2] hover:bg-[#1A91DA]';
      break;
    case 'telegram':
      shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
      Icon = TelegramIcon;
      label = 'Telegram';
      colorClasses = 'bg-[#24A1DE] hover:bg-[#2295CC]';
      break;
    case 'generic':
      const handleGenericShare = () => {
        if (navigator.share) {
          navigator.share({
            title: 'Join me on MineHub!',
            text: text,
            url: url,
          }).catch(console.error);
        } else {
          navigator.clipboard.writeText(url);
          addToast('Share link copied to clipboard!', 'info');
        }
      };
      return (
        <button onClick={handleGenericShare} className="flex items-center justify-center w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
          <ShareIcon className="w-5 h-5 mr-2" />
          Share
        </button>
      );
  }
  
  return (
    <a href={shareUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center w-full px-4 py-2 ${colorClasses} text-white font-semibold rounded-lg transition-colors`}>
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </a>
  );
};


const ReferralPage: React.FC = () => {
    const { currentUser } = useContext(AppContext);
    const { addToast } = useToast();

    // Generate a unique, user-specific referral code.
    const referralCode = `${currentUser.username.toUpperCase().replace(/\s/g, '')}-${currentUser.id.slice(-4)}`;
    const referralLink = `https://minehub.app/join?ref=${referralCode}`;
    const shareText = `Join me on MineHub! It's a great way to manage crypto mining. Use my referral link:`;
    
    // This would be fetched from a backend in a real application. For now, it's an empty array.
    const referredUsers: { id: string; username: string; status: string; earnings: number }[] = [];
    
    const totalReferred = referredUsers.length;
    const totalEarnings = referredUsers.reduce((sum, user) => sum + user.earnings, 0);

    const handleCopy = (textToCopy: string, type: 'link' | 'code') => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            addToast(`Referral ${type} copied!`, 'success');
        });
    };
    
    const statusIndicator = (status: 'mining' | 'online' | 'offline') => {
        const baseClasses = "h-2.5 w-2.5 rounded-full mr-2 flex-shrink-0";
        switch(status) {
            case 'mining': return <span className={`${baseClasses} bg-green-500 animate-pulse`} title="Mining"></span>;
            case 'online': return <span className={`${baseClasses} bg-green-500`} title="Online"></span>;
            case 'offline': return <span className={`${baseClasses} bg-red-500`} title="Offline"></span>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center space-x-4">
                <UsersIcon className="w-10 h-10 text-primary" />
                <h1 className="text-3xl font-bold">Referral System</h1>
            </div>
            <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-2">Share Your Code & Earn</h2>
                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                    Invite friends to MineHub and earn a percentage of their mining rewards. The more they mine, the more you earn!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Your Unique Referral Link</label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                  type="text"
                                  readOnly
                                  value={referralLink}
                                  className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border p-2 focus:ring-0 focus:outline-none font-mono text-xs"
                              />
                              <button 
                                  onClick={() => handleCopy(referralLink, 'link')}
                                  className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-primary bg-primary text-primary-content text-sm font-medium hover:bg-primary-focus"
                              >
                                  <ClipboardIcon className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                      <div>
                         <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Or share on social media:</p>
                         <div className="flex space-x-2">
                            <SocialShareButton network="twitter" text={shareText} url={referralLink} />
                            <SocialShareButton network="telegram" text={shareText} url={referralLink} />
                            <SocialShareButton network="generic" text={shareText} url={referralLink} />
                         </div>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg">
                          <h3 className="font-semibold text-light-text-secondary dark:text-dark-text-secondary">Referred Users</h3>
                          <p className="text-3xl font-bold text-primary">{totalReferred}</p>
                      </div>
                      <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg">
                          <h3 className="font-semibold text-light-text-secondary dark:text-dark-text-secondary">Total Bonus Earnings</h3>
                          <p className="text-3xl font-bold text-primary">${totalEarnings.toFixed(2)}</p>
                      </div>
                  </div>
                </div>
            </div>

            <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg">
                 <h2 className="text-xl font-semibold mb-4">Your Referrals</h2>
                 <div className="overflow-x-auto">
                     <table className="min-w-full">
                         <thead>
                             <tr>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase">User</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase">Status</th>
                                 <th className="px-4 py-2 text-right text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase">Earnings from User</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-light-border dark:divide-dark-border">
                            {referredUsers.length > 0 ? (
                                 referredUsers.map(user => (
                                     <tr key={user.id}>
                                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-light-text dark:text-dark-text">{user.username}</td>
                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                            <div className="flex items-center">
                                              {statusIndicator(user.status as any)}
                                              <span className="capitalize">{user.status}</span>
                                            </div>
                                         </td>
                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-green-500 font-mono">${user.earnings.toFixed(4)}</td>
                                     </tr>
                                 ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center py-8 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                        You have no referred users yet. Share your link to start earning!
                                    </td>
                                </tr>
                            )}
                         </tbody>
                     </table>
                 </div>
            </div>
        </div>
    );
}

export default ReferralPage;