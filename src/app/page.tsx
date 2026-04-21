"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Country, City } from "country-state-city";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js"; // L'outil de validation mondial
import { AuroraBackground } from "@/components/ui/aurora-background";
import { AnimatedText } from "@/components/ui/animated-text";
import { GooeyText } from "@/components/ui/gooey-text";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SlideButton } from "@/components/ui/slide-button";
import { BorderBeam } from "@/components/ui/border-beam";
import NavHeader from "@/components/ui/nav-header";
import { cn } from "@/lib/utils";
import { Zap, ShieldCheck, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TechStraTixLanding() {
  const [intro, setIntro] = useState(true);
  const allCountries = useMemo(() => Country.getAllCountries(), []);
  
  // États du formulaire
  const [formData, setFormData] = useState({ nom: "", whatsapp: "", email: "", pays: "Cameroon", ville: "" });
  const [errors, setErrors] = useState<any>({});
  const [isOtherCity, setIsOtherCity] = useState(false);

  // Déduire les infos du pays sélectionné (Variable unique pour tout le fichier)
  const countryObj = useMemo(() => 
    allCountries.find(c => c.name === formData.pays) || allCountries.find(c => c.isoCode === "CM") || allCountries[0]
  , [formData.pays, allCountries]);

  const cities = useMemo(() => City.getCitiesOfCountry(countryObj.isoCode) || [], [countryObj]);

  useEffect(() => {
    const timer = setTimeout(() => setIntro(false), 7500);
    return () => clearTimeout(timer);
  }, []);

  // FILTRE DE SAISIE (Chiffres uniquement)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Interdit tout sauf 0-9
    setFormData({ ...formData, whatsapp: value });
    setErrors({ ...errors, whatsapp: "" });
  };

  // VALIDATION EXPERTE MONDIALE
  const validate = () => {
    let err: any = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 1. Nom obligatoire
    if (formData.nom.length < 2) err.nom = true;

    // 2. Validation WhatsApp Mondiale
    const phoneNumber = parsePhoneNumberFromString(formData.whatsapp, countryObj.isoCode as CountryCode);
    
    if (countryObj.isoCode === "CM") {
        if (!phoneNumber || !phoneNumber.isValid()) {
            err.whatsapp = "Numéro invalide (9 chiffres requis)";
        }
    } else {
        if (formData.whatsapp && (!phoneNumber || !phoneNumber.isValid())) {
            err.whatsapp = "Format invalide pour ce pays";
        }
    }

    // 3. Validation Email (Obligatoire hors CM)
    if (countryObj.isoCode !== "CM") {
      if (!formData.email || !emailRegex.test(formData.email)) {
        err.email = "Email requis à l'international";
      }
    } else if (formData.email && !emailRegex.test(formData.email)) {
      err.email = "Format email incorrect";
    }

    // 4. Ville
    if (!formData.ville) err.ville = true;

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ENVOI SUPABASE CORRIGÉ
 const handleSuccess = async () => {
  console.log("🚀 Lancement de la procédure d'inscription...");

  try {
    // 1. Préparation des données
    const payload = {
      nom: formData.nom,
      whatsapp: `+${countryObj.phonecode}${formData.whatsapp}`,
      email: formData.email || "Non renseigné",
      pays: formData.pays,
      ville: formData.ville
    };

    // 2. Enregistrement dans Supabase
    const { error: supabaseError } = await supabase
      .from('leads')
      .insert([payload]);

    if (supabaseError) throw new Error("Erreur Supabase: " + supabaseError.message);
    
    console.log("✅ Données enregistrées dans Supabase.");

    // 3. ENVOI DU MAIL D'ALERTE (Via ta route API Resend)
    // On ne bloque pas l'utilisateur si le mail échoue, on utilise un fetch silencieux
    const mailResponse = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const mailResult = await mailResponse.json();
    
    if (mailResult.success) {
      console.log("✅ Alerte email envoyée avec succès !");
    } else {
      console.error("❌ Échec de l'envoi du mail :", mailResult.error);
    }

    // 4. Message de succès final à l'utilisateur
    alert("Félicitations Yann ! Ton accès Beta TechStraTix est réservé. Prépare ton envol digital.");

  } catch (error: any) {
    console.error("❌ Erreur générale :", error.message);
    alert("Désolé, une erreur est survenue. Vérifie ta connexion.");
  }
};

  return (
    <div className="bg-[#000D1A] min-h-screen text-white">
      <AnimatePresence mode="wait">
        {intro ? (
          <motion.div key="intro" exit={{ opacity: 0, scale: 1.1 }} className="fixed inset-0 z-[200] bg-[#000D1A] flex flex-col items-center justify-center p-6 text-center">
            <motion.div layoutId="main-logo" className="w-32 h-32 md:w-44 md:h-44 rounded-3xl overflow-hidden border-2 border-ts-cyan shadow-glow mb-8">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </motion.div>
            <GooeyText texts={["TECHSTRATIX", "INNOVATION", "STRATEGIE"]} />
          </motion.div>
        ) : (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
            <NavHeader />
            <AuroraBackground>
              <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center pt-32 pb-20">
                
                {/* SECTION GAUCHE */}
                <div className="space-y-8 text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ts-cyan/10 border border-ts-cyan/40 text-ts-cyan text-[9px] font-black uppercase tracking-widest">
                    <Star size={12} className="animate-pulse" /> Pack Fondateur Actif
                  </div>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter">
                    Préparez votre <span className="text-ts-cyan">envol</span> digital.
                  </h1>
                  <p className="text-lg md:text-2xl text-ts-silver/70 italic border-l-4 border-ts-blue pl-6">
                    "Une plateforme pensée par des tech pour des entrepreneurs."
                  </p>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex-1">
                      <Zap className="text-ts-cyan mb-2" />
                      <h4 className="font-bold text-lg">-20% PIONNIER <span className="text-red-600">*</span></h4>
                      <p className="text-xs text-ts-silver italic">Sur vos 3 premiers mois.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex-1">
                      <ShieldCheck className="text-ts-silver mb-2" />
                      <h4 className="font-bold text-lg">AUDIT EXPERT <span className="text-red-600">*</span></h4>
                      <p className="text-xs text-ts-silver italic">Analyse stratégique offerte.</p>
                    </div>
                  </div>
                </div>

                {/* SECTION DROITE (FORMULAIRE) */}
                <div className="relative group p-[2px] rounded-[3.5rem] overflow-hidden shadow-2xl">
                  <div className="relative bg-[#050505]/90 backdrop-blur-3xl p-8 md:p-14 rounded-[3.5rem] border border-white/10">
                    <BorderBeam size={350} duration={12} className="opacity-80" />
                    
                    <h3 className="text-4xl font-bold mb-2">Inscription</h3>
                    <p className="text-ts-silver/50 text-xs mb-10 italic">Les astérisques <span className="text-red-600 font-bold">*</span> sont obligatoires.</p>

                    <div className="space-y-6 text-left">
                      {/* NOM */}
                      <div className="space-y-2">
                        <Label>Nom & Prénom <span className="text-red-600 font-bold">*</span></Label>
                        <Input 
                          placeholder="Ex: Yann ou Jason" 
                          className={cn("bg-white/5 h-14 border-white/10 text-white", errors.nom && "border-red-600")}
                          onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* WHATSAPP */}
                        <div className="space-y-2">
                          <Label>WhatsApp {countryObj.isoCode === "CM" && <span className="text-red-600 font-bold">*</span>}</Label>
                          <div className={cn(
                            "flex items-center bg-black/40 border rounded-xl px-4 h-14 transition-all",
                            errors.whatsapp ? "border-red-600" : "border-white/10"
                          )}>
                            <span className="text-ts-cyan font-bold text-xs pr-3 border-r border-white/10 mr-3 select-none">
                              +{countryObj.phonecode}
                            </span>
                            <input 
                              type="tel"
                              value={formData.whatsapp}
                              onChange={handlePhoneChange}
                              className="bg-transparent w-full outline-none text-white text-sm"
                              placeholder="Numéro"
                            />
                          </div>
                          {errors.whatsapp && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.whatsapp}</p>}
                        </div>

                        {/* EMAIL */}
                        <div className="space-y-2">
                          <Label>E-mail {countryObj.isoCode !== "CM" && <span className="text-red-600 font-bold">*</span>}</Label>
                          <Input 
                            type="email" 
                            className={cn("bg-white/5 h-14 border-white/10 text-white", errors.email && "border-red-600")}
                            placeholder="mail@tech.com"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                          {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* PAYS */}
                        <div className="space-y-2">
                          <Label>Pays <span className="text-red-600 font-bold">*</span></Label>
                          <div className="relative">
                            <select 
                              className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-sm appearance-none outline-none focus:border-ts-cyan text-white cursor-pointer pr-10"
                              onChange={(e) => setFormData({...formData, pays: e.target.value, whatsapp: ""})}
                              value={formData.pays}
                            >
                              {allCountries.map(c => <option key={c.isoCode} value={c.name}>{c.flag} {c.name}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ts-cyan opacity-50">▼</div>
                          </div>
                        </div>

                        {/* VILLE */}
                        <div className="space-y-2">
                          <Label>Ville <span className="text-red-600 font-bold">*</span></Label>
                          <div className="relative">
                            {!isOtherCity ? (
                              <>
                                <select 
                                  className={cn(
                                    "w-full bg-[#111] border border-white/10 p-4 rounded-xl text-sm text-white outline-none focus:border-ts-cyan appearance-none cursor-pointer pr-10",
                                    errors.ville && "border-red-600"
                                  )}
                                  onChange={(e) => e.target.value === "AUTRE" ? setIsOtherCity(true) : setFormData({...formData, ville: e.target.value})}
                                >
                                  <option value="">Sélectionner...</option>
                                  {cities.slice(0, 30).map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                                  <option value="AUTRE" className="text-ts-cyan font-bold">-- AUTRE --</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ts-cyan opacity-50">▼</div>
                              </>
                            ) : (
                              <div className="relative">
                                <Input 
                                  placeholder="Entrez votre ville" 
                                  className="h-14 bg-white/5 border-ts-cyan text-white"
                                  onChange={(e) => setFormData({...formData, ville: e.target.value})}
                                />
                                <button onClick={() => setIsOtherCity(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-ts-cyan underline font-bold">RETOUR</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-8">
                         <SlideButton onValidate={validate} onSuccess={handleSuccess} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AuroraBackground>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}