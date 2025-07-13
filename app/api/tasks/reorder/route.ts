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

    // Parse request body
    const { taskId, newPosition, categoryId } = await request.json()

    if (typeof taskId !== 'string' || typeof newPosition !== 'number' || typeof categoryId !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // Get current task
    const { data: currentTask, error: fetchError } = await supabase
      .from('tasks')
      .select('position')
      .eq('id', taskId)
      .eq('user_id', session.user.id)
      .single()

    if (fetchError || !currentTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const oldPosition = currentTask.position || 0

    // Get all tasks in the category to reorder them
    const { data: categoryTasks, error: tasksError } = await supabase
      .from('tasks')
      .select('id, position')
      .eq('category_id', categoryId)
      .eq('user_id', session.user.id)
      .order('position', { ascending: true })

    if (tasksError || !categoryTasks) {
      return NextResponse.json({ error: 'Failed to fetch category tasks' }, { status: 500 })
    }

    // Update positions for affected tasks
    if (oldPosition < newPosition) {
      // Moving down: shift tasks up
      for (const task of categoryTasks) {
        if (task.position !== null && task.position > oldPosition && task.position <= newPosition) {
          await supabase
            .from('tasks')
            .update({ position: task.position - 1 })
            .eq('id', task.id)
            .eq('user_id', session.user.id)
        }
      }
    } else if (oldPosition > newPosition) {
      // Moving up: shift tasks down
      for (const task of categoryTasks) {
        if (task.position !== null && task.position >= newPosition && task.position < oldPosition) {
          await supabase
            .from('tasks')
            .update({ position: task.position + 1 })
            .eq('id', task.id)
            .eq('user_id', session.user.id)
        }
      }
    }

    // Update the moved task's position
    const { error: updateError } = await supabase
      .from('tasks')
      .update({ position: newPosition })
      .eq('id', taskId)
      .eq('user_id', session.user.id)

    if (updateError) {
      console.error('Error updating task position:', updateError)
      return NextResponse.json({ error: 'Failed to update task position' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}