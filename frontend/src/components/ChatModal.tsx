import React, { useState, useRef, useEffect } from 'react';
import { SendOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';


const ChatWindow = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFirst, setIsFirst] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]) as any;
    const botReply = "I'm a bot. This is a bot reply.";

    const chatContentRef = useRef(null) as any;

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const scrollToBottom = () => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    };

    const handleUserInput = (e: any) => {
        setUserInput(e.target.value);
    };

    const handleSend = () => {
        if (userInput.trim() !== '') {
            const newMessage = { message: userInput, type: 'user' };
            setChatMessages((prevMessages: any) => [...prevMessages, newMessage]);
            setUserInput('');

            setTimeout(() => {
                const botMessage = { message: botReply, type: 'bot' };
                setChatMessages((prevMessages: any) => [...prevMessages, botMessage]);
            }, 500);
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isFirst) {
            setIsFirst(!isFirst);
            setTimeout(() => {
                const botMessage = { message: "你好！ 需要什麽幫助嗎？", type: 'bot' };
                setChatMessages((prevMessages: any) => [...prevMessages, botMessage]);
            }, 500)
        }
    };

    return (

        <>
            <Button
                className={`chat-window chat-icon ${isOpen ? 'hide' : ''}`}
                type="primary"
                shape="circle"
                size="large"
                icon={<SendOutlined />}
                title='推薦工作'
                onClick={toggleChat}
            />
            {isOpen && ( // Render chat window only if isOpen is true
                <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                    <div className={`chat-box ${isOpen ? 'slide-in' : ''}`}>
                        <div className="chat-header">
                            <h3>職涯建議機器人</h3>
                            <Button type="text" icon={<CloseOutlined />} onClick={toggleChat} />
                        </div>
                        <div className="chat-content" ref={chatContentRef}>
                            {chatMessages.map((msg: any, index: any) => (
                                <div
                                    key={index}
                                    className={`chat-message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`}
                                >
                                    {msg.message}
                                </div>
                            ))}
                        </div>
                        <div className="chat-input">
                            <Input
                                placeholder="Type a message..."
                                value={userInput}
                                onChange={handleUserInput}
                                onPressEnter={handleSend}
                            />
                            <Button className={`chat-icon ${isOpen ? '' : 'hide'}`} type="primary" onClick={handleSend} icon={<SendOutlined />} />

                        </div>
                    </div>
                </div>
            )}
        </>

    );
};

export default ChatWindow;
