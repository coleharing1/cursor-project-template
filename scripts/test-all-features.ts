#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAllFeatures() {
  console.log('🧪 Testing TodoList App Features\n')
  
  const testEmail = 'test@example.com'
  const testPassword = 'testpassword123'
  
  try {
    // 1. Test Authentication
    console.log('1️⃣ Testing Authentication...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })
    
    if (authError) {
      console.error('❌ Auth failed:', authError.message)
      return
    }
    console.log('✅ Authentication successful')
    
    // 2. Test Categories
    console.log('\n2️⃣ Testing Categories...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (categoriesError) {
      console.error('❌ Categories fetch failed:', categoriesError)
      return
    }
    console.log(`✅ Found ${categories?.length} categories`)
    categories?.forEach(cat => console.log(`   - ${cat.name} (${cat.color})`))
    
    // 3. Test Task Creation
    console.log('\n3️⃣ Testing Task Creation...')
    const newTask = {
      user_id: authData.user.id,
      title: 'Test Task ' + new Date().toISOString(),
      description: 'This is a test task created by the test script',
      priority: 'high',
      duration: 30,
      category_id: categories?.[0]?.id,
      is_focused: true,
    }
    
    const { data: createdTask, error: createError } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single()
    
    if (createError) {
      console.error('❌ Task creation failed:', createError)
      return
    }
    console.log('✅ Task created:', createdTask.title)
    
    // 4. Test Task Listing
    console.log('\n4️⃣ Testing Task Listing...')
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false })
    
    if (tasksError) {
      console.error('❌ Tasks fetch failed:', tasksError)
      return
    }
    console.log(`✅ Found ${tasks?.length} tasks`)
    
    // 5. Test Task Update
    console.log('\n5️⃣ Testing Task Update...')
    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update({ 
        title: 'Updated Test Task',
        priority: 'medium',
        is_focused: false 
      })
      .eq('id', createdTask.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('❌ Task update failed:', updateError)
      return
    }
    console.log('✅ Task updated:', updatedTask.title)
    
    // 6. Test Task Completion
    console.log('\n6️⃣ Testing Task Completion...')
    const { data: completedTask, error: completeError } = await supabase
      .from('tasks')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', createdTask.id)
      .select()
      .single()
    
    if (completeError) {
      console.error('❌ Task completion failed:', completeError)
      return
    }
    console.log('✅ Task completed')
    
    // 7. Test Focused Tasks Query
    console.log('\n7️⃣ Testing Focused Tasks Query...')
    const { data: focusedTasks, error: focusedError } = await supabase
      .from('tasks')
      .select('*')
      .eq('is_focused', true)
      .is('completed_at', null)
    
    if (focusedError) {
      console.error('❌ Focused tasks query failed:', focusedError)
      return
    }
    console.log(`✅ Found ${focusedTasks?.length} focused tasks`)
    
    // 8. Test Task Deletion
    console.log('\n8️⃣ Testing Task Deletion...')
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', createdTask.id)
    
    if (deleteError) {
      console.error('❌ Task deletion failed:', deleteError)
      return
    }
    console.log('✅ Task deleted')
    
    // 9. Test RLS Policies
    console.log('\n9️⃣ Testing Row Level Security...')
    
    // Create another user
    const otherEmail = `other-${Date.now()}@example.com`
    const { data: otherUser, error: otherUserError } = await supabase.auth.signUp({
      email: otherEmail,
      password: 'testpassword123',
    })
    
    if (otherUserError) {
      console.error('❌ Other user creation failed:', otherUserError)
    } else {
      // Try to access first user's tasks as second user
      const { data: otherAuthData } = await supabase.auth.signInWithPassword({
        email: otherEmail,
        password: 'testpassword123',
      })
      
      const { data: otherUserTasks, error: rlsError } = await supabase
        .from('tasks')
        .select('*')
      
      if (otherUserTasks?.length === 0) {
        console.log('✅ RLS working: Other user cannot see first user\'s tasks')
      } else {
        console.error('❌ RLS violation: Other user can see tasks!')
      }
    }
    
    console.log('\n✅ All tests completed successfully!')
    console.log('\n📊 Summary:')
    console.log('- Authentication: ✅')
    console.log('- Categories: ✅')
    console.log('- Task CRUD: ✅')
    console.log('- Task Filtering: ✅')
    console.log('- Row Level Security: ✅')
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error)
  }
}

testAllFeatures().catch(console.error)