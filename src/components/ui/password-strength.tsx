import * as React from "react"
import { Check, X } from "lucide-react"

interface PasswordStrengthProps {
  password?: string
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[@$!%*?&]/.test(password),
  }

  const score = Object.values(criteria).filter(Boolean).length

  const getStrengthLabel = () => {
    if (password.length === 0) return ""
    if (score <= 2) return "Weak password"
    if (score <= 4) return "Fair password"
    return "Strong password"
  }

  const getBarColorClass = () => {
    if (score <= 2) return "bg-destructive"
    if (score <= 4) return "bg-orange-400"
    return "bg-green-500"
  }

  const getLabelColorClass = () => {
    if (score <= 2) return "text-destructive"
    if (score <= 4) return "text-orange-500"
    return "text-green-500"
  }

  if (password.length === 0) return null

  return (
    <div className="space-y-2 mt-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">Password strength:</span>
        <span className={`font-semibold ${getLabelColorClass()}`}>
          {getStrengthLabel()}
        </span>
      </div>
      <div className="flex gap-1 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${getBarColorClass()} transition-all duration-300`}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
        <Criterion label="Minimum 8 characters" met={criteria.length} />
        <Criterion label="At least one uppercase letter" met={criteria.uppercase} />
        <Criterion label="At least one lowercase letter" met={criteria.lowercase} />
        <Criterion label="At least one number" met={criteria.number} />
        <Criterion label="At least one special character (@$!%*?&)" met={criteria.specialChar} />
      </div>
    </div>
  )
}

function Criterion({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {met ? (
        <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
      ) : (
        <X className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
      )}
      <span className={met ? "text-foreground" : ""}>{label}</span>
    </div>
  )
}
