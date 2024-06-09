'use server'

import { supabase } from "@/utils/supabase";

export async function getUserInfo(uid: string) {
  let { data: user, error } = await supabase
    .from('users')
    .select("*")
    .eq('user_id', uid)

  if (error) {
    return { code: -1, message: error.message }
  }

  return { code: 0, user: user || []}
}
