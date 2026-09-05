'use client';

import React from 'react';
import { MasterProfileForm } from '@/components/profile/MasterProfileForm';
import { UserCheck } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <UserCheck className="w-6 h-6 text-cyan-400" /> Master Career Profile
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Maintain your source knowledge base, verified accomplishments, and target roles for AI synthesis.
        </p>
      </div>

      <MasterProfileForm />
    </div>
  );
}
