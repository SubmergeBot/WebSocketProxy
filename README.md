# 🛰 WebSocketProxy

## How it works:

1. Master connects to WebSocket (as master)
2. Slaves get assigned IDs and connect to WebSockets with those IDs
3. Slaves send messages, they are forwarded to master with slave ID attached
4. Master can send slaves messages by attaching their ID in a message
