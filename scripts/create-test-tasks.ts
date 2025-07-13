#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createTestTasks() {
  console.log('Creating test tasks...\n')
  
  // Sign in as a test user first
  const testEmail = 'test@example.com'
  const testPassword = 'testpassword123'
  
  console.log(`1. Signing in as ${testEmail}...`)
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  })
  
  if (signInError) {
    console.error('Login error:', signInError)
    return
  }
  
  const userId = signInData.user?.id
  console.log('✓ Logged in successfully')
  
  // Get categories
  console.log('\n2. Fetching categories...')
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
  
  if (categoriesError || !categories || categories.length === 0) {
    console.error('No categories found. Please run create-default-categories.ts first')
    return
  }
  
  console.log(`✓ Found ${categories.length} categories`)
  
  // Create test tasks
  const testTasks = [
    {
      user_id: userId,
      title: 'Review quarterly report',
      description: 'Go through Q4 financial results and prepare summary',
      priority: 'high',
      duration: 60,
      category_id: categories.find(c => c.name === 'Work')?.id,
      is_focused: true,
    },
    {
      user_id: userId,
      title: 'Team meeting preparation',
      description: 'Prepare agenda and slides for tomorrow\'s meeting',
      priority: 'high',
      duration: 45,
      category_id: categories.find(c => c.name === 'Work')?.id,
      is_focused: true,
    },
    {
      user_id: userId,
      title: 'Morning workout',
      description: '30 min cardio + 15 min strength training',
      priority: 'medium',
      duration: 45,
      category_id: categories.find(c => c.name === 'Health')?.id,
      is_focused: true,
    },
    {
      user_id: userId,
      title: 'Read React documentation',
      description: 'Study new React 19 features',
      priority: 'medium',
      duration: 30,
      category_id: categories.find(c => c.name === 'Learning')?.id,
      is_focused: false,
    },
    {
      user_id: userId,
      title: 'Grocery shopping',
      description: 'Buy vegetables, fruits, and weekly essentials',
      priority: 'low',
      duration: 45,
      category_id: categories.find(c => c.name === 'Personal')?.id,
      is_focused: false,
    },
    {
      user_id: userId,
      title: 'Call dentist for appointment',
      description: 'Schedule regular checkup',
      priority: 'low',
      duration: 10,
      category_id: categories.find(c => c.name === 'Health')?.id,
      is_focused: false,
    },
  ]
  
  console.log('\n3. Creating test tasks...')
  
  for (const task of testTasks) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single()
    
    if (error) {
      console.error(`Error creating task "${task.title}":`, error)
    } else {
      console.log(`✓ Created task: ${task.title}`)
    }
  }
  
  console.log('\n✅ Test tasks created successfully!')
  console.log('\nYou can now:')
  console.log('1. Visit http://localhost:3003 (or the appropriate port) to see the app')
  console.log('2. Log in with:', testEmail)
  console.log('3. View and manage your tasks')
}

createTestTasks().catch(console.error)