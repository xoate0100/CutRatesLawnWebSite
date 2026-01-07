"use client"

import { useLogger } from "@/lib/context/app-context"
import { Button } from "@/components/ui/button"

export function LoggerExample() {
  const logger = useLogger()

  const handleLogError = () => {
    try {
      throw new Error("Test error")
    } catch (error) {
      logger.error("An error occurred", error)
    }
  }

  const handleLogInfo = () => {
    logger.info("Information message", { timestamp: new Date() })
  }

  const handleLogWarning = () => {
    logger.warn("Warning message", { level: "medium" })
  }

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-4">Logger Example</h2>
      <div className="flex space-x-2">
        <Button onClick={handleLogInfo} variant="outline">
          Log Info
        </Button>
        <Button onClick={handleLogWarning} variant="outline">
          Log Warning
        </Button>
        <Button onClick={handleLogError} variant="outline">
          Log Error
        </Button>
      </div>
    </div>
  )
}
