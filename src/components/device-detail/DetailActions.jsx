import React from 'react';
import { Copy, Globe, Share2 } from 'lucide-react';
import ActionButton from './ActionButton';

const DetailActions = ({ device }) => {
  const copyToClipboard = (text) => {
    if (text) navigator.clipboard.writeText(text);
  };

  const openLink = (url) => {
    if (!url || typeof url !== 'string') return;
    let link = url.trim();
    if (!link) return;
    if (!/^https?:\/\//i.test(link)) {
      link = 'https://' + link;
    }
    try {
      const parsed = new URL(link);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        window.open(parsed.toString(), '_blank', 'noopener,noreferrer');
      }
    } catch {
      // Ignore malformed URLs safely
    }
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
