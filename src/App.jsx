import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  // 메시지 목록을 저장하는 State
  const [messages, setMessages] = useState([]);
  // 입력창의 텍스트를 저장하는 State
  const [inputValue, setInputValue] = useState('');
  
  // 스크롤을 항상 아래로 유지하기 위한 Ref
  const messagesEndRef = useRef(null);

  // 메시지가 추가될 때마다 스크롤을 아래로 내림
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송 함수
  const sendMessage = () => {
    if (inputValue.trim() === '') return;

    // 1. 사용자 메시지 추가
    const userMessage = { sender: '나', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    
    // 입력창 비우기 (현재 텍스트를 임시 저장 후 초기화)
    const currentText = inputValue;
    setInputValue('');

    // 2. 봇 응답 (1초 후)
    setTimeout(() => {
      const botMessage = { sender: '봇', text: `"${currentText}"라고 하셨군요!` };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  // 엔터키 처리 함수
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="app-container">
      <h1>나의 챗봇</h1>

      {/* 메시지 출력 영역 */}
      <div id="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg.sender}: {msg.text}
          </div>
        ))}
        {/* 스크롤 자동 이동을 위한 보이지 않는 요소 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="input-area">
        <input
          type="text"
          id="message-input"
          placeholder="메시지 입력..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>전송</button>
      </div>

      {/* 푸터 */}
      <footer>
        <p>&copy; 2024 나의 챗봇. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App