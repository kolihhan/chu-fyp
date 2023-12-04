import React, { useState, useRef, useEffect } from 'react';
import { SendOutlined, CloseOutlined, MailOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { chatRecommendation } from '../api';


const ChatWindow = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFirst, setIsFirst] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userReply, setUserReply] = useState([]) as any;
    const [chatMessages, setChatMessages] = useState([
        {
            type: 'bot',
            message:
                "您好！歡迎使用聊天窗口。請回答以下問題以繼續:\n\n" +
                "你有什麼興趣？(多個選項請用括號分開）",
        },
    ]);

    const botQuestions = [
        "你有什麼愛好？(多個選項請用括號分開）",
    ];

    const chatContentRef = useRef(null) as any;

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    useEffect(() => {
        toggleChat();
    }, []);

    const scrollToBottom = () => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    };

    const handleUserInput = (e: any) => {
        setUserInput(e.target.value);
    };

    const handleSend = async () => {
        if (userInput.trim() !== '') {
            const newMessage = { message: userInput, type: 'user' };
            setChatMessages((prevMessages: any) => [...prevMessages, newMessage]);
            setUserReply((prevMessages: any) => [...prevMessages, userInput]);

            setUserInput('');

            const botReply = "點擊重置按鈕，重新開始測試";

            if (currentQuestion < 1) {
                setTimeout(() => {
                    const botMessage = { message: botQuestions[currentQuestion], type: 'bot' };
                    setChatMessages((prevMessages: any) => [...prevMessages, botMessage]);
                }, 500);
            } else {
                try {
                    const response = await chatRecommendation([...userReply, userInput]);

                    setTimeout(() => {
                        const botMessage = { message: response.data.predicted_job_title , type: 'bot' };
                        setChatMessages((prevMessages: any) => [...prevMessages, botMessage]);
                    }, 500);
    
    
                    setTimeout(() => {
                        const botMessage = { message: botReply, type: 'bot' };
                        setChatMessages((prevMessages: any) => [...prevMessages, botMessage]);
                    }, 1500);

                  } catch (error) {
                    console.log(error);
                  }
            }
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isFirst) {
            setIsFirst(!isFirst);
        }

    };

    const handleRefresh = () => {
        setUserInput('');
        setChatMessages([
            {
                type: 'bot',
                message:
                    "您好！歡迎使用聊天窗口。請回答以下問題以繼續:\n\n" +
                    "你有什麼興趣？(多個選項請用括號分開）",
            },
        ]);
        setUserReply([]);
        setCurrentQuestion(0);
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
                                    {msg.message && msg.message.split('\n').map((line: any, i: any) => (
                                        <span key={i}>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="chat-input">
                            <Input
                                placeholder="Type a message..."
                                value={userInput}
                                onChange={handleUserInput}
                                onPressEnter={handleSend}
                                disabled={currentQuestion == 2}
                            />
                            <Button className={`chat-icon ${isOpen ? '' : 'hide'}`} type="primary" onClick={currentQuestion == 2 ? handleRefresh : handleSend} icon={currentQuestion == 2 ? <ReloadOutlined /> : <SendOutlined />} />

                        </div>
                    </div>
                </div>
            )}
        </>

    );
};

export default ChatWindow;
