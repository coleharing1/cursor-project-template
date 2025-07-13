#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createDefaultCategories() {
  console.log('Creating default categories...\n')
  
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
    console.log('\nTrying to create user first...')
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    })
    
    if (signUpError) {
      console.error('Signup error:', signUpError)
      return
    }
    
    // Sign in again
    const { data: reSignInData, error: reSignInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })
    
    if (reSignInError) {
      console.error('Re-login error:', reSignInError)
      return
    }
  }
  
  console.log('✓ Logged in successfully')
  
  // Check if categories already exist
  const { data: existingCategories, error: checkError } = await supabase
    .from('categories')
    .select('id')
    .limit(1)
  
  if (existingCategories && existingCategories.length > 0) {
    console.log('\n✓ Categories already exist, skipping creation')
    return
  }
  
  // Create default categories
  const defaultCategories = [
    { name: 'Work', color: '#3B82F6', icon: 'briefcase', header: 'Professional' },
    { name: 'Personal', color: '#10B981', icon: 'home', header: 'Life' },
    { name: 'Health', color: '#EF4444', icon: 'heart', header: 'Wellness' },
    { name: 'Learning', color: '#8B5CF6', icon: 'book', header: 'Growth' },
  ]
  
  console.log('\n2. Creating default categories...')
  
  for (const category of defaultCategories) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        ...category,
        user_id: signInData?.user?.id || (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single()
    
    if (error) {
      console.error(`Error creating category ${category.name}:`, error)
    } else {
      console.log(`✓ Created category: ${category.name}`)
    }
  }
  
  console.log('\n✅ Default categories created successfully!')
  console.log('\nYou can now:')
  console.log('1. Visit http://localhost:3003 (or the appropriate port) to see the app')
  console.log('2. Log in with:', testEmail)
  console.log('3. Create new tasks with categories')
}

createDefaultCategories().catch(console.error)