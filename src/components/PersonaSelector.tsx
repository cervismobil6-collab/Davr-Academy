import React from 'react';
import {
  Sparkles,
  Code,
  BookOpen,
  Briefcase,
  Smile,
  CheckCircle2,
  Edit3,
  RefreshCw,
  Sliders,
  MessageSquare,
  GraduationCap,
} from 'lucide-react';
import { BotConfig, PersonaPreset } from '../types';

interface PersonaSelectorProps {
  config: BotConfig;
  presets: PersonaPreset[];
  onSelectPersona: (preset: PersonaPreset) => void;
  onUpdatePrompt: (newPrompt: string) => void;
  isLoading: boolean;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  config,
  presets,
  onSelectPersona,
  onUpdatePrompt,
  isLoading,
}) => {
  const [isCustomizing, setIsCustomizing] = React.useState(false);
  const [customPromptText, setCustomPromptText] = React.useState(config.customPrompt);

  React.useEffect(() => {
    setCustomPromptText(config.customPrompt);
  }, [config.customPrompt]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Code':
        return <Code className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'Smile':
        return <Smile className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const handleSavePrompt = () => {
    onUpdatePrompt(customPromptText);
    setIsCustomizing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 to-indigo-800 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              2-qadam: Botning Xarakteri (Persona)
            </h2>
            <p className="text-xs text-indigo-200">
              Botingiz qaysi sohada va qanday uslubda javob berishini tanlang
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            isCustomizing
              ? 'bg-white text-indigo-900'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5 mr-1.5" />
          {isCustomizing ? 'Tayyor shablonlarga qaytish' : 'Maxsus prompt yozish'}
        </button>
      </div>

      <div className="p-6">
        {!isCustomizing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presets.map((preset) => {
                const isSelected = config.personaId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => onSelectPersona(preset)}
                    className={`group relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-indigo-300 bg-white hover:bg-gray-50/50'
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                        }`}
                      >
                        {preset.badge}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-start space-x-3 mt-1">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                        }`}
                      >
                        {getIcon(preset.iconName)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-900">
                          {preset.title}
                        </h3>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">
                          {preset.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Current Active Persona Prompt Preview */}
            <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Joriy tizim ko'rsatmasi (System Prompt):
                  </span>
                </div>
                <button
                  onClick={() => setIsCustomizing(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center"
                >
                  <Edit3 className="w-3 h-3 mr-1" /> O'zgartirish
                </button>
              </div>
              <p className="text-xs text-gray-700 font-mono bg-white p-3 rounded-lg border border-gray-200 whitespace-pre-wrap max-h-36 overflow-y-auto">
                {config.customPrompt}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                Botning maxsus yo'riqnomasi (System Instruction / Prompt)
              </label>
              <p className="text-xs text-gray-600 mb-2">
                Bu yerdan bot qaysi tilda, qanday ohangda va qaysi qoidalarga bo'ysunib javob berishini batafsil yozishingiz mumkin.
              </p>
              <textarea
                value={customPromptText}
                onChange={(e) => setCustomPromptText(e.target.value)}
                rows={7}
                placeholder="Sen o'zbek tilida javob beradigan aqlli va muloyim yordamchi botsan..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all"
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setCustomPromptText(config.customPrompt);
                  setIsCustomizing(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSavePrompt}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Maxsus promptni saqlash
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
