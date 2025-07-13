// Client-side service to check if daily reset is needed
export class DailyResetService {
  private static STORAGE_KEY = 'lastResetDate'

  static async runResetIfNeeded(): Promise<void> {
    const lastResetDate = localStorage.getItem(this.STORAGE_KEY)
    const today = new Date().toDateString()

    if (lastResetDate === today) {
      // Already reset today
      return
    }

    try {
      const response = await fetch('/api/tasks/daily-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to reset daily tasks')
      }

      // Update last reset date
      localStorage.setItem(this.STORAGE_KEY, today)
      
      // Reload the page to refresh all data
      window.location.reload()
    } catch (error) {
      console.error('Error during daily reset:', error)
    }
  }

  static shouldResetToday(): boolean {
    const lastResetDate = localStorage.getItem(this.STORAGE_KEY)
    const today = new Date().toDateString()
    return lastResetDate !== today
  }
}