"use client"
import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/services/auth';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function TelegramLogin() {
    const {isAuthenticated, login } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();

    const telegramId = searchParams.get("id");
    const code = searchParams.get("code");

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }else if (telegramId && code){
            handleLogin();
        }
    }, []);

    const handleLogin = async() =>{
        try {
            const data = {id: telegramId, code : code}
            const res = await AuthService.login(data);
            login(res.token);
            router.push('/dashboard')
        } catch (error: any) {
            console.log(error)
        }
    }

    return (
        <div>

        </div>
    )
}
