import { createClient } from "@/utils/supabase/client";

/**
 * Get the current user's role from user_profiles table
 * Returns 'user' or 'admin'
 */
export async function getUserRole(): Promise<'user' | 'admin' | null> {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    // Get user profile with role
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error);
      return 'user'; // Default to user if error
    }
    
    return profile?.role || 'user';
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return 'user'; // Default to user if error
  }
}

/**
 * Check if current user is an admin
 */
export async function isUserAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'admin';
}

/**
 * Get redirect path based on user role
 * Admin -> /admin/dashboard
 * User -> /customer
 */
export async function getRedirectPath(): Promise<string> {
  const role = await getUserRole();
  
  if (role === 'admin') {
    return '/admin';
  }
  
  return '/customer';
}

/**
 * Create or update user profile with role (for registration)
 */
export async function createUserProfile(userId: string, role: 'user' | 'admin' = 'user') {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        role: role,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });
    
    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    throw error;
  }
}