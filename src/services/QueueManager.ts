export interface QueueItem {
    title: string;
    encoded: string;
    requester: string;
}

export class QueueManager {
    private static queues: Map<string, QueueItem[]> = new Map();

    static getQueue(guildId: string): QueueItem[] {
        if (!this.queues.has(guildId)) {
            this.queues.set(guildId, []);
        }
        return this.queues.get(guildId)!;
    }

    static addToQueue(guildId: string, item: QueueItem) {
        const queue = this.getQueue(guildId);
        queue.push(item);
    }

    static getNextItem(guildId: string): QueueItem | undefined {
        const queue = this.getQueue(guildId);
        return queue.shift(); // Ambil lagu terdepan dan hapus dari list
    }

    static clearQueue(guildId: string) {
        this.queues.delete(guildId);
    }
}