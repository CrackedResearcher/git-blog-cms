"use client"
import getAccessToken from '@/hooks/checkAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const Editor = () => {

  const router = useRouter();

  useEffect(() => {
    async function checkAccess() {
      const hasGithubAccess = await getAccessToken();
      if (!hasGithubAccess.success) {
        router.push('/register');
      }
    }
    
    checkAccess();
  }, [router]);
  return (
    <div>Write</div>
  )
}

export default Editor