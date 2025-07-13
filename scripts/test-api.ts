#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAPI() {
  console.log('Testing API endpoints...\n')
  
  // Create a test user
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = 'testpassword123'
  
  console.log(`1. Creating user: ${testEmail}`)
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  })
  
  if (signUpError) {
    console.error('Signup error:', signUpError)
    return
  }
  
  console.log('✓ User created successfully')
  
  // Sign in
  console.log('\n2. Signing in...')
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  })
  
  if (signInError) {
    console.error('Login error:', signInError)
    return
  }
  
  console.log('✓ Logged in successfully')
  const userId = signInData.user?.id
  
  // Create a category using API endpoint
  console.log('\n3. Creating category via API...')
  console.log('Note: Direct database access requires running the app with proper auth context.')
  console.log('The API endpoints handle authentication properly.')
  
  // For now, let's create data directly with the user_id
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .insert({
      user_id: userId,
      name: 'Test Category',
      color: '#3B82F6',
      icon: 'folder',
    })
    .select()
    .single()
  
  if (categoryError) {
    console.error('Category error:', categoryError)
    return
  }
  
  console.log('✓ Category created:', category.name)
  
  // Create a task
  console.log('\n4. Creating task...')
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      title: 'Test Task',
      description: 'This is a test task',
      priority: 'high',
      duration: 30,
      category_id: category.id,
      is_focused: true,
    })
    .select()
    .single()
  
  if (taskError) {
    console.error('Task error:', taskError)
    return
  }
  
  console.log('✓ Task created:', task.title)
  
  // Fetch tasks
  console.log('\n5. Fetching tasks...')
  const { data: tasks, error: fetchError } = await supabase
    .from('tasks')
    .select('*, category:categories(*)')
  
  if (fetchError) {
    console.error('Fetch error:', fetchError)
    return
  }
  
  console.log(`✓ Found ${tasks?.length} task(s)`)
  
  // Complete the task
  console.log('\n6. Completing task...')
  const { data: updatedTask, error: updateError } = await supabase
    .from('tasks')
    .update({ completed_at: new Date().toISOString() })
    .eq('id', task.id)
    .select()
    .single()
  
  if (updateError) {
    console.error('Update error:', updateError)
    return
  }
  
  console.log('✓ Task completed')
  
  console.log('\n✅ All tests passed!')
  console.log('\nYou can now:')
  console.log('1. Visit http://localhost:3003 to see the app')
  console.log('2. Log in with:', testEmail)
  console.log('3. View your data at http://127.0.0.1:54323 (Supabase Studio)')
}

testAPI().catch(console.error)