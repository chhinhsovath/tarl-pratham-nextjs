'use client';

import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button, Card, Typography } from 'antd';

const { Title, Text } = Typography;

export default function ClearSessionPage() {
  const [clearing, setClearing] = useState(false);

  const clearSession = async () => {
    setClearing(true);
    
    try {
      // Clear NextAuth session
      await signOut({ 
        callbackUrl: '/auth/login',
        redirect: false 
      });
      
      // Clear local storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies for this domain
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Force redirect after a moment
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 1000);
      
    } catch (error) {
      console.error('Error clearing session:', error);
      setClearing(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Card style={{ maxWidth: 400, textAlign: 'center' }}>
        <Title level={3}>Clear Session</Title>
        <Text>This will clear all cached sessions and cookies.</Text>
        <br /><br />
        <Button 
          type="primary" 
          size="large"
          loading={clearing}
          onClick={clearSession}
          style={{ width: '100%' }}
        >
          {clearing ? 'Clearing Session...' : 'Clear Session & Login Again'}
        </Button>
      </Card>
    </div>
  );
}