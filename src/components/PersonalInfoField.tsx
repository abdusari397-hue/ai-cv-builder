'use client';

import React, { useRef, useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import AIInput from './AIInput';
import { getTranslation } from '@/lib/i18n/translations';
import { Loader2, Upload, X, Globe } from 'lucide-react';

export default function PersonalInfoField() {
  const { 
    fullName, setFullName, email, setEmail, phone, setPhone, 
    postalCode, setPostalCode, location, setLocation, language,
    profilePhoto, setProfilePhoto,
    linkedIn, setLinkedIn, github, setGithub, portfolio, setPortfolio,
    houseNumber, setHouseNumber
  } = useResumeStore();
  const t = getTranslation(language);
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePostalCodeChange = (val: string) => {
    setPostalCode(val);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (val.trim().length >= 4) {
      setIsFetchingAddress(true);
      debounceRef.current = setTimeout(async () => {
        try {
          if (language === 'nl') {
            const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(val)}`);
            if (res.ok) {
              const data = await res.json();
              if (data.response?.docs?.length > 0) {
                const doc = data.response.docs[0];
                const city = doc.woonplaatsnaam;
                const street = doc.straatnaam;
                if (city) {
                  setLocation(`${street ? street + ', ' : ''}${city}, Nederland`);
                }
              }
            }
          } else {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(val)}&format=json&addressdetails=1`);
            if (res.ok) {
              const data = await res.json();
              if (data && data.length > 0) {
                const address = data[0].address;
                const city = address.city || address.town || address.village || address.state;
                const country = address.country;
                if (city && country) {
                  setLocation(`${city}, ${country}`);
                }
              }
            }
          }
        } catch (e) {
          console.error('Error fetching address:', e);
        } finally {
          setIsFetchingAddress(false);
        }
      }, 800);
    } else {
      setIsFetchingAddress(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setProfilePhoto(dataUrl);
        } else {
          setProfilePhoto(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Profile Photo */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Upload size={24} className="text-slate-400" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-bold text-slate-900">{t.profilePhoto}</label>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              {t.uploadPhoto}
            </button>
            {profilePhoto && (
              <button
                onClick={() => setProfilePhoto('')}
                className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
              >
                {t.removePhoto}
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">{t.fullName}</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t.fullNamePlaceholder}
          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">{t.email}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium text-left"
            dir="ltr"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">{t.phone}</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+966 50 000 0000"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium text-left"
            dir="ltr"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">{t.postalCode}</label>
          <div className="relative">
            <input
              type="text"
              value={postalCode}
              onChange={(e) => handlePostalCodeChange(e.target.value)}
              placeholder={t.postalCodePlaceholder}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium text-left"
              dir="ltr"
            />
            {isFetchingAddress && (
              <Loader2 className="absolute right-3 top-3.5 animate-spin text-indigo-500" size={18} />
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">{t.location}</label>
          <AIInput
            value={location}
            onChange={(val) => setLocation(val)}
            placeholder={t.locationPlaceholder}
            fieldType={t.location}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">{t.houseNumber}</label>
          <input
            type="text"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            placeholder={t.houseNumberPlaceholder}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium text-left"
            dir="ltr"
          />
        </div>
      </div>

      {/* Professional Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-bold text-slate-900 mb-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-blue-600"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            {t.linkedIn}
          </label>
          <input
            type="url"
            value={linkedIn}
            onChange={(e) => setLinkedIn(e.target.value)}
            placeholder="linkedin.com/in/..."
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium text-left text-sm"
            dir="ltr"
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-sm font-bold text-slate-900 mb-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-slate-800"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            {t.github}
          </label>
          <input
            type="url"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="github.com/..."
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium text-left text-sm"
            dir="ltr"
          />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-sm font-bold text-slate-900 mb-2">
            <Globe size={14} className="text-green-600" />
            {t.portfolioLink}
          </label>
          <input
            type="url"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            placeholder="www.yoursite.com"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium text-left text-sm"
            dir="ltr"
          />
        </div>
      </div>
    </div>
  );
}
