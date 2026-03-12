export interface AutomationOpportunity {
  task: string
  description: string
  estimated_time_saving_percentage: number
  confidence?: 'high' | 'medium'
  note?: string
}

export interface AssessmentResult {
  job_title: string
  total_automatable_tasks: number
  estimated_time_saving_percentage: number
  summary_headline: string
  current_automation_opportunities: AutomationOpportunity[]
  emerging_automation_opportunities: AutomationOpportunity[]
  role_context_note: string
}
