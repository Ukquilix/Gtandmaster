
import React, { useState, useEffect, useRef } from 'react';
import { type Message, Sender } from './types';
import { startChatSession } from './services/geminiService';
import ChatInput from './components/ChatInput';
import LoadingIndicator from './components/LoadingIndicator';
import FireIcon from './components/icons/FireIcon';
import { type Chat } from '@google/genai';

const App: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const chatSession = startChatSession();
            setChat(chatSession);
            setMessages([
                {
                    id: 'init',
                    sender: Sender.AI,
                    text: 'The path is inward. Speak.',
                },
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to initialize AI session.');
            console.error(err);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);
    
    const handleSendMessage = async (text: string) => {
        if (!chat || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), text, sender: Sender.User };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);
        
        const aiMessageId = (Date.now() + 1).toString();
        // Add a placeholder for the AI response
        setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: Sender.AI }]);

        try {
            const stream = await chat.sendMessageStream({ message: text });

            for await (const chunk of stream) {
                const chunkText = chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === aiMessageId ? { ...msg, text: msg.text + chunkText } : msg
                ));
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`The connection faltered. ${errorMessage}`);
            console.error(err);
            // Remove the empty AI message on error
            setMessages(prev => prev.filter(msg => msg.id !== aiMessageId));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-black text-gray-300 min-h-screen flex flex-col font-sans">
            <header className="flex items-center justify-center p-4 border-b border-gray-800/50 shadow-lg shadow-black/20">
                <FireIcon className="w-6 h-6 text-amber-500 mr-3"/>
                <h1 className="text-xl font-semibold tracking-wider text-gray-200">CLEAN FIRE</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    {messages.map((msg, index) => (
                        <div key={msg.id + '-' + index} className={`flex items-start gap-4 ${msg.sender === Sender.User ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === Sender.AI && (
                                <div className="w-8 h-8 flex-shrink-0 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                                    <FireIcon className="w-5 h-5 text-amber-600" />
                                </div>
                            )}
                            <div className={`max-w-xl rounded-xl px-5 py-3 ${msg.sender === Sender.User 
                                ? 'bg-gray-800 text-gray-300 rounded-br-none' 
                                : 'bg-transparent text-gray-200'
                            }`}>
                                <p className={`whitespace-pre-wrap ${msg.sender === Sender.AI ? 'font-serif-display text-xl md:text-2xl leading-relaxed text-gray-100' : 'text-base'}`}>
                                    {msg.text}
                                </p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-4 justify-start">
                             <div className="w-8 h-8 flex-shrink-0 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                                <FireIcon className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="max-w-xl rounded-xl px-5 py-3">
                                <LoadingIndicator />
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="flex justify-center">
                            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-lg text-center">
                                {error}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            <footer className="sticky bottom-0 bg-black/50 backdrop-blur-sm">
                <div className="max-w-3xl mx-auto p-2 md:p-4">
                     <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
            </footer>
        </div>
    );
};

export default App;
