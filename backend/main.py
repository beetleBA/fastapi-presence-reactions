from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

AVAILABLE_REACTIONS = {
    "🔥": 0,
    "❤️": 0,
    "😂": 0,
    "😒": 0,
    "😮": 0
}


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        self.active_connections.append(websocket)
        await self.broadcast()

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    def add_reaction(self, reaction):
        if reaction in AVAILABLE_REACTIONS:
            AVAILABLE_REACTIONS[reaction] += 1

    async def broadcast(self, new_reaction=None):
        count = len(self.active_connections)
        for connection in self.active_connections[:]:
            try:
                await connection.send_json({'online': count, "reactions": AVAILABLE_REACTIONS, "new_reaction": new_reaction})
            except Exception:
                if connection in self.active_connections:
                    self.active_connections.remove(connection)


manager = ConnectionManager()


@app.websocket("/ws/reactions")
async def websocket_online(websocket: WebSocket):
    await websocket.accept()
    await manager.connect(websocket)

    try:
        while True:
            data = await websocket.receive_json()
            if data.get('action') == 'react':
                reaction = data.get('emoji')
                manager.add_reaction(reaction)
                await manager.broadcast(new_reaction=reaction)

    except (WebSocketDisconnect, RuntimeError, Exception) as e:
        print(f"Соединение закрыто или прервано: {e}")
        manager.disconnect(websocket)
        await manager.broadcast()
