"use client"
import { AuthService } from '@/services/auth';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function TelegramLogin() {

    const searchParams = useSearchParams();
    const router = useRouter();


    const telegramId = searchParams.get("id");
    const code = searchParams.get("code");

    useEffect(() => {
        handleLogin();
    }, []);

    const handleLogin = async() =>{
        const data = {id: telegramId, code : code}
        await AuthService.login(data);
    }

    return (
        <div>
            <h2>Trang đăng nhập</h2>

        </div>
    )
}
