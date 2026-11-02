export class AnswerRuns {
  private readonly inFlight = new Map<string, AbortController>();
  private readonly claimedOrders = new Map<string, number>();
  private readonly running = new Map<string, Set<AbortController>>();
  private lastOrder = 0;

  nextOrder(): number {
    this.lastOrder += 1;
    return this.lastOrder;
  }

  track(sessionId: string, controller: AbortController): () => void {
    const controllers = this.running.get(sessionId) ?? new Set();
    controllers.add(controller);
    this.running.set(sessionId, controllers);
    return () => {
      controllers.delete(controller);
      if (!controllers.size) this.running.delete(sessionId);
    };
  }

  claim(sessionId: string, controller: AbortController, order: number): void {
    this.inFlight.get(sessionId)?.abort();
    this.inFlight.set(sessionId, controller);
    this.claimedOrders.set(sessionId, order);
  }

  isStale(sessionId: string, order: number): boolean {
    return order < (this.claimedOrders.get(sessionId) ?? 0);
  }

  complete(sessionId: string, controller: AbortController): void {
    if (this.inFlight.get(sessionId) === controller) {
      this.inFlight.delete(sessionId);
    }
  }

  release(sessionId: string): void {
    this.running.get(sessionId)?.forEach((controller) => controller.abort());
    this.claimedOrders.delete(sessionId);
  }
}
