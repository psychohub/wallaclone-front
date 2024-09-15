import React from 'react';
import { TwitterShareButton, FacebookShareButton, TwitterIcon, FacebookIcon } from 'react-share';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import './SocialShare.css';

interface SocialShareProps {
  url: string;
  title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
  return (
    <div className="social-share">
      <TwitterShareButton url={url} title={title}>
        <FontAwesomeIcon icon={faXTwitter} size="2x" />
      </TwitterShareButton>
      <FacebookShareButton url={url} hashtag="#Wallaclone">
        <FacebookIcon size={32} round />
      </FacebookShareButton>
    </div>
  );
};

export default SocialShare;