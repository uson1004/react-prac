import { useState, useEffect } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

const App = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenerativeAI(apiKey);
      const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ];
      const generativeModel = ai.getGenerativeModel({ model: 'gemini-pro-latest', safetySettings });
      setModel(generativeModel);
    }
  }, []);

  const sendMessage = async () => {
    if (!model) {
      alert('모델이 준비되지 않았습니다. API 키를 확인해주세요.');
      return;
    }

    setLoading(true);
    const userMessage = { role: 'user', parts: [{ text: message }] };
    const fullHistory = [...chatHistory, userMessage];
    setChatHistory(fullHistory);
    setMessage('');

    try {
      const result = await model.generateContent({ contents: fullHistory });
      const response = await result.response;

      if (response.promptFeedback?.blockReason) {
        const errorMessage = {
          role: 'error',
          text: `응답이 차단되었습니다. 이유: ${response.promptFeedback.blockReason}`,
        };
        setChatHistory(prev => [...prev, errorMessage]);
        return;
      }

      const text = response.text();

      if (text) {
        const botMessage = { role: 'model', parts: [{ text: text }] };
        setChatHistory(prev => [...prev, botMessage]);
      } else {
        const errorMessage = {
          role: 'error',
          text: 'AI의 응답이 비어있습니다. 다른 질문을 시도해보세요.',
        };
        setChatHistory(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Detailed error sending message:', error);
      const errorMessage = {
        role: 'error',
        text: `메시지 전송 중 오류 발생: ${error.message}`,
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            {/* 마크다운 렌더링을 위해 ReactMarkdown 컴포넌트 사용 */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.parts ? msg.parts[0].text : msg.text}
            </ReactMarkdown>
          </div>
        ))}
        {loading && <div className="chat-message model">AI가 생각중...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
          placeholder="메시지를 입력하세요..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>전송</button>
      </div>
    </div>
  );
};

export default App;
