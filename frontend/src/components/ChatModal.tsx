import React, { useState, useRef, useEffect } from 'react';
import { SendOutlined, CloseOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';


const ChatWindow = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFirst, setIsFirst] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]) as any;
    const botReply = "I'm a bot. This is a bot reply.";

    const chatContentRef = useRef(null) as any;

    const questions = 
    "你有什麼興趣或愛好？\n 你喜歡獨自工作還是團隊合作？ 你完成了哪個教育程度？ 你對進入特定行業或職業有任何疑慮嗎？"

    const getInfo = () => {
        if (userInput.trim() !== '') {
            const newMessage = { message: userInput, type: 'user' };
            setChatMessages((prevMessages: any) => [...prevMessages, newMessage]);
            setUserInput('');
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    useEffect(() => {
        toggleChat();
    },[]);

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
            setTimeout(() => {
                const botMessage = { message: questions, type: 'bot' };
                setChatMessages((prevMessages: any) => [...prevMessages, botMessage]);
            }, 500)
            setIsFirst(!isFirst);
        }

    };

    return (

        <>
            <Button
                className={`chat-window chat-icon ${isOpen ? 'hide' : ''}`}
                type="primary"
                shape="circle"
                size="large"
                icon={<MailOutlined />}
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
