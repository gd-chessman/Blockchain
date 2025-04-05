"use client"
import { useAuth } from '@/hooks/useAuth';
import { TelegramWalletService } from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, Suspense } from 'react'
import { toast } from 'react-toastify';

function TelegramLoginContent() {
    const {isAuthenticated, login } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();

    const telegramId = searchParams.get("id");
    const code = searchParams.get("code");

    useEffect(() => {
        if (isAuthenticated) {
            window.location.href = '/dashboard';
        }else if (telegramId && code){
            handleLogin();
        }
    }, []);

    const handleLogin = async() =>{
        try {
            const data = {id: telegramId, code : code}
            const res = await TelegramWalletService.login(data);
            console.log(res)
            if(res.status == 401){
                toast.warn("Invalid authentication !")
            }
            if(res.status == 200){
                login(res.token);
                window.location.href = '/dashboard';
            }

        } catch (error: any) {
            console.log(error)
        }
    }

    return (
        <div>

        </div>
    )
}

export default function TelegramLogin() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TelegramLoginContent />
        </Suspense>
    )
}
