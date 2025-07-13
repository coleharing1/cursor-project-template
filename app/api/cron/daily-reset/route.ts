import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create a Supabase client with service role key for admin access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

    // Reset all focused tasks that are not completed for all users
    const { error } = await supabase
      .from('tasks')
      .update({ is_focused: false })
      .eq('is_focused', true)
      .is('completed_at', null)

    if (error) {
      console.error('Error resetting daily tasks:', error)
      return NextResponse.json({ error: 'Failed to reset daily tasks' }, { status: 500 })
    }

    console.log('Daily reset completed successfully at', new Date().toISOString())
    return NextResponse.json({ 
      success: true, 
      message: 'Daily tasks reset successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Unexpected error in daily reset cron:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}