import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { taskSchema } from '@/lib/validations/task'
import type { Database } from '@/types/database'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const includeCompleted = searchParams.get('includeCompleted') === 'true'
    const categoryId = searchParams.get('categoryId')
    const isFocused = searchParams.get('is_focused')
    const parentId = searchParams.get('parentId')

    // Build query
    let query = supabase
      .from('tasks')
      .select(`
        *,
        category:categories(id, name, color, icon)
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    // Apply filters
    if (!includeCompleted) {
      query = query.is('completed_at', null)
    }
    
    if (categoryId) {
      if (categoryId === 'null') {
        query = query.is('category_id', null)
      } else {
        query = query.eq('category_id', categoryId)
      }
    }
    
    if (isFocused !== null) {
      query = query.eq('is_focused', isFocused === 'true')
    }
    
    if (parentId !== undefined) {
      if (parentId === 'null') {
        query = query.is('parent_id', null)
      } else {
        query = query.eq('parent_id', parentId)
      }
    }

    const { data: tasks, error } = await query

    if (error) {
      console.error('Error fetching tasks:', error)
      console.error('Query parameters:', {
        includeCompleted,
        categoryId,
        isFocused,
        parentId,
        userId: session.user.id
      })
      return NextResponse.json({ error: 'Failed to fetch tasks', details: error.message }, { status: 500 })
    }

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = taskSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    // Create task
    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        ...validationResult.data,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        category:categories(id, name, color, icon)
      `)
      .single()

    if (error) {
      console.error('Error creating task:', error)
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
    }

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}