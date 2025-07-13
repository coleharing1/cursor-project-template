import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { updateTaskSchema } from '@/lib/validations/task'
import type { Database } from '@/types/database'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch task
    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        category:categories(id, name, color, icon),
        subtasks:tasks!parent_id(*)
      `)
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 })
      }
      console.error('Error fetching task:', error)
      return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = updateTaskSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { data: validatedData } = validationResult

    // Create a mutable object for the update payload
    const updatePayload: { [key: string]: any } = { ...validatedData }

    // Convert duration from minutes to an interval string for Supabase
    if (updatePayload.duration !== undefined && updatePayload.duration !== null) {
      updatePayload.duration = `${updatePayload.duration} minutes`
    } else if (updatePayload.duration === null) {
      // Ensure null is passed correctly if duration is cleared
      updatePayload.duration = null
    }

    // Update task
    const { data: task, error } = await supabase
      .from('tasks')
      .update({
        ...updatePayload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .select(`
        *,
        category:categories(id, name, color, icon)
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 })
      }
      console.error('Error updating task:', error)
      return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete task
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', params.id)
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Error deleting task:', error)
      return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}