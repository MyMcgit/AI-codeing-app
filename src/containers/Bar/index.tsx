import { useEffect, useRef } from 'react';

export default function Bar() {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket 已连接');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('收到消息:', data);
      } catch (e) {
        console.log('收到非 JSON 消息:', event.data);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket 已关闭', event.code);
    };

    ws.onerror = (error) => {
      console.error('WebSocket 错误:', error);
    };

    return () => {
      ws.close(1000, '组件卸载');
    };
  }, []);

  return <div>Bar</div>;
}
