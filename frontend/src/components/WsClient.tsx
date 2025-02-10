import { useEffect, useRef, useState } from "react";


const WsClient = () => {
    const ws = useRef<WebSocket | null>(null);
    const [message, setMessage] = useState('');

    
    
    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080');

        ws.current.onopen = () => console.log("WebSocket connected");
        ws.current.onerror = (event) => console.error("WebSocket Error:", event);
        ws.current.onmessage = (event) => {
            console.log(JSON.parse(event.data));
        };
        ws.current.onclose = () => console.log("WebSocket disconnected");

        return () => {
            ws.current?.close();
        };
    }, []);

    const handleSend = () => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(message);
        } 
        
        else {
            console.error("WebSocket is not connected.");
        }
        setMessage('');
    };

    return (
        <>
            <input value={message} onChange={e => setMessage(e.currentTarget.value)} />
            <button onClick={handleSend}>Send</button>
        </>
    );
}

export default WsClient;
