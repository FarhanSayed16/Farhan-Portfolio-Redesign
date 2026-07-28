type EventHandler = (data?: unknown) => void;

class GameBridge {
  private events: Record<string, EventHandler[]> = {};

  on(event: string, handler: EventHandler) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(handler);
  }

  off(event: string, handler: EventHandler) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((h) => h !== handler);
  }

  emit(event: string, data?: unknown) {
    if (!this.events[event]) return;
    this.events[event].forEach((h) => h(data));
  }
}

export const gameBridge = new GameBridge();
