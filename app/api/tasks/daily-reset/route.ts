import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Reset all focused tasks that are not completed
    const { error } = await supabase
      .from('tasks')
      .update({ is_focused: false })
      .eq('user_id', session.user.id)
      .eq('is_focused', true)
      .is('completed_at', null)

    if (error) {
      console.error('Error resetting daily tasks:', error)
      return NextResponse.json({ error: 'Failed to reset daily tasks' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Daily tasks reset successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}