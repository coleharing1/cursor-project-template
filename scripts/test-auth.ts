#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuth() {
  console.log('Testing Supabase authentication...')
  
  // Test signup
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = 'testpassword123'
  
  console.log(`\nTesting signup with email: ${testEmail}`)
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  })
  
  if (signUpError) {
    console.error('Signup error:', signUpError)
  } else {
    console.log('Signup successful!')
    console.log('User:', signUpData.user?.email)
    console.log('Session:', signUpData.session ? 'Created' : 'Not created (email confirmation required)')
  }
  
  // Test login (will fail if email confirmation is required)
  console.log(`\nTesting login...`)
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  })
  
  if (signInError) {
    console.error('Login error:', signInError.message)
  } else {
    console.log('Login successful!')
    console.log('Session created:', !!signInData.session)
  }
  
  // Check local email service
  console.log('\n📧 Check emails at: http://127.0.0.1:54324')
  console.log('This is where confirmation emails are sent in local development')
}

testAuth().catch(console.error)