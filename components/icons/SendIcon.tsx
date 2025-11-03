
import React from 'react';

interface SendIconProps {
    className?: string;
}

const SendIcon: React.FC<SendIconProps> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="m22 2-11 11" />
    </svg>
);

export default SendIcon;
