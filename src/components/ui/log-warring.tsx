import { useLang } from '@/lang';
import React from 'react'


export default function LogWarring() {
    const { t } = useLang();
    return (
        <div className='flex flex-col items-center justify-center h-[80vh]'>
            <p className='text-yellow-500'>{t("errors.PLTVI")}</p>
        </div>
    )
}
