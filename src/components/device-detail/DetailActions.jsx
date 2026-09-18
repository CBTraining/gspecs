import React from 'react';
import { Copy, Globe, Share2 } from 'lucide-react';
import ActionButton from './ActionButton';

const DetailActions = ({ device }) => {
  const copyToClipboard = (text) => {
    if (text) navigator.clipboard.writeText(text);
  };

  const openLink = (url) => {
    let link = url;
    if (link && !link.startsWith('http')) {
      link = 'https://' + link;
    }
    if (link) window.open(link, '_blank');
  };

  return (
    <div className="action-buttons-row">
      <ActionButton 
        icon={Copy} 
        label="SKU" 
        successLabel="SKU Copied!" 
        onClick={() => copyToClipboard(device.SKU)} 
      />
      <ActionButton 
        icon={Copy} 
        label="UPC" 
        successLabel="UPC Copied!" 
        onClick={() => copyToClipboard(device.UPC)} 
      />
      <ActionButton 
        icon={Globe} 
        label="Bestbuy.com" 
        successLabel="Opening..." 
        onClick={() => openLink(device['Device Online Listing'])} 
      />
      <ActionButton 
        icon={Share2} 
        label="Share Link" 
        successLabel="Link Copied!" 
        onClick={() => {
          const shareUrl = `${window.location.origin}${window.location.pathname}?sku=${encodeURIComponent(device.SKU)}`;
          copyToClipboard(shareUrl);
        }} 
      />
    </div>
  );
};

export default DetailActions;
