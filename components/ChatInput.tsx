
import React, { useState, useRef, useEffect } from 'react';
import SendIcon from './icons/SendIcon';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const resizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(resizeTextarea, [text]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() && !isLoading) {
            onSendMessage(text.trim());
            setText('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-end space-x-3 p-2 border-t border-gray-800">
            <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="The mind is a battlefield. Speak."
                rows={1}
                className="flex-1 bg-gray-900 text-gray-300 placeholder-gray-500 rounded-lg p-3 resize-none focus:ring-1 focus:ring-amber-500 focus:outline-none transition-shadow duration-200 max-h-40 overflow-y-auto"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || !text.trim()}
                className="w-12 h-12 flex-shrink-0 bg-amber-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-amber-500 disabled:bg-gray-700 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
            >
                <SendIcon className="w-6 h-6" />
            </button>
        </form>
    );
};

export default ChatInput;
